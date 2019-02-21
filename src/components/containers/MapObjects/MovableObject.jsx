import React from 'react';
import { Rect, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';

export default class MovableObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPointed: false,
    };
  }

  componentDidMount() {
    const { checkObjectLocation, object } = this.props;
    checkObjectLocation(object);
  }

  componentDidUpdate(prevProps) {
    const { checkObjectLocation, object } = this.props;

    // проверим границы для измененного объекта:
    // будем проверять границы при каждом изменении размеров объекта:
    if (prevProps.object.width !== object.width 
        || prevProps.object.coordinates.x !== object.coordinates.x 
        || prevProps.object.coordinates.y !== object.coordinates.y) {
      checkObjectLocation(object);
    }
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  // 1. Держать координаты в границах глобальной области:
  checkBoundaries(x, y) {
    const { mapWidth, mapHeight, object } = this.props;
    // проверяем границы для X:
    let checkedX = x;
    if (checkedX <= 0) {
      checkedX = 0;
    } else if (checkedX >= (mapWidth - object.width)) {
      checkedX = mapWidth - object.width;
    }
    // проверяем границы для Y:
    let checkedY = y;
    if (checkedY <= 0) {
      checkedY = 0;
    } else if (checkedY >= (mapHeight - object.height)) {
      checkedX = mapHeight - object.height;
    }
     
    return { checkedX, checkedY };
  }

  // 2. Показать tooltip-информацию:
  showTooltipObjectInfo = e => {
    const { object, user } = this.props;

    const tooltipLayer = e.target.getStage().children[2];
    const tooltip = tooltipLayer.children[0];

    tooltip.position({
      x: e.currentTarget.x(),
      y: e.currentTarget.y(),
    });

    // добавить текст:
    let text = objectCategories.find(cat => cat.id === object.category).title;
    if (object.category === 'table') {
      text += ' :\n';
      text += user !== undefined ? user.title : 'пустой';
    } else if (object.title !== undefined) {
      text += ` :\n${object.title}`;
    }

    tooltip.getText().setText(text);
    tooltip.show();
    tooltipLayer.draw();

    // позаботимся о выделении объекта:
    this.setState({
      isPointed: true,
    });
  };

  // 3. Скрыть tooltip-информацию:
  hideTooltipObjectInfo = e => {
    const tooltipLayer = e.target.getStage().children[2];
    const tooltip = tooltipLayer.children[0];

    tooltip.hide();
    tooltipLayer.draw();

    // позаботимся о выделении объекта:
    this.setState({
      isPointed: false,
    });
  };

  // ОБРАБОТКА СОБЫТИЙ:
  // ---------------------------------------------------------
  onObjectDragStart = e => {
    const { hideContextMenu, object, shareObjectData } = this.props;

    // выведем объект на передний план:
    e.currentTarget.moveToTop();

    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    shareObjectData(object.id, userId);
    hideContextMenu();
  };

  onObjectDragEnd = e => {
    const { showShadow, stopShadow, shareObjectData, blockSnapSize, object } = this.props;

    const { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
    e.currentTarget.position({
      x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
      y: Math.round(checkedY / blockSnapSize) * blockSnapSize,
    });

    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]);
    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    shareObjectData(object.id, userId);

    stopShadow();
  };

  onObjectDragMove = e => {
    const { showShadow, object } = this.props;

    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]);
    this.showTooltipObjectInfo(e);
  };

  onObjectClick = e => {
    // всегда сообщаем id объекта:
    const { shareObjectData, object } = this.props;

    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    shareObjectData(object.id, userId);

    // выведем объект на передний план:
    e.currentTarget.moveToTop();
  };

  onObjectContextMenu = e => {
    const { showContextMenu, openCurrentObjectTab } = this.props;
    e.evt.preventDefault();

    showContextMenu(e.evt.clientX, e.evt.clientY);
    // открыть окно редактирования:
    openCurrentObjectTab();
  };

  onObjectMouseMove = e => {
    this.showTooltipObjectInfo(e);
  };

  onObjectMouseOut = e => {
    this.hideTooltipObjectInfo(e);
  };

  render() {
    const { object, setColor } = this.props;
    const { isPointed } = this.state;
    const userId = object.userId;

    // draw a picture:
    let { shiftX, shiftY, scale } = getIconSettings(object.category);

    // отредактируем размер иконки по размеру объекта:
    const minSizeObjectValue = object.width < object.height ? object.width : object.height;
    const minSizeValue = 15;
    const scaleIncrease = minSizeObjectValue / minSizeValue;

    shiftX *= scaleIncrease;
    shiftY *= scaleIncrease;
    scale *= scaleIncrease;

    const drawIcon = iconPaths[object.category].path.map((path, i) => {
      return (
        <Path
          key={i}
          x={object.width / 2 - shiftX}
          y={object.height / 2 - shiftY}
          data={path}
          fill="black"
          scale={{
            x: scale,
            y: scale,
          }}
        />
      );
    });

    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
        draggable={true}
        onDragStart={this.onObjectDragStart}
        onDragEnd={this.onObjectDragEnd}
        onDragMove={this.onObjectDragMove}
        onClick={this.onObjectClick}
        onContextMenu={this.onObjectContextMenu}
        onMouseEnter={this.onObjectMouseMove}
        onMouseLeave={this.onObjectMouseOut}
        name="object"
        nameID={object.id}
      >
        <Rect
          width={object.width}
          height={object.height}
          fill={setColor(object.id, object.correctLocation, object.color, userId)}
          opacity={isPointed ? 0.5 : 1}
          // stroke="black"
          // strokeWidth={0.5}
          shadowColor="black"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
          shadowOpacity={0.4}
        />
        {drawIcon}
      </Group>
    );
  }
}
