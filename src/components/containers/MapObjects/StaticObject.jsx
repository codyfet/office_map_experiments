import React from 'react';
import { Rect, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';

export default class StaticObject extends React.PureComponent {
  constructor(props) {
    super(props);

    const { object } = props;

    this.state = {
      objectIcon: this.drawIcon(object),
      isPointed: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { object } = this.props;

    // проверим границы для измененного объекта:
    // будем проверять границы при каждом изменении размеров и координат объекта:
    if (prevProps.object.width !== object.width 
        || prevProps.object.height !== object.height) {
      this.setState({
        objectIcon: this.drawIcon(object)
      });
    }
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  // 0. Нарисовать иконку на объекте:
  drawIcon(object) {
    let { shiftX, shiftY, scale } = getIconSettings(object);

    return iconPaths[object.category].path.map((path, i) => {
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
  }

  // 1. Показать tooltip-информацию:
  showTooltipObjectInfo = (e) => {
    const { object } = this.props;

    const tooltipLayer = e.target.getStage().children[2];
    const tooltip = tooltipLayer.children[0];

    tooltip.position({
      x: e.currentTarget.x(),
      y: e.currentTarget.y(),
    });

    // добавить текст:
    let text = objectCategories.find(cat => cat.id === object.category).title;
    if (object.title !== undefined) {
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

  // 2. Скрыть tooltip-информацию:
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
  handleObjectClick = (e) => {
    // всегда сообщаем id объекта:
    const { setCurrentObject, object } = this.props;

    setCurrentObject(object.id, object.userId);

    // выведем объект на передний план:
    e.currentTarget.moveToTop();
  };

  handleObjectContextMenu = (e) => {
    const { showContextMenu, openCurrentObjectTab } = this.props;
    e.evt.preventDefault();

    showContextMenu(e.evt.clientX, e.evt.clientY);
    // открыть окно редактирования:
    openCurrentObjectTab();
  };

  handleObjectMouseMove = (e) => {
    this.showTooltipObjectInfo(e);
  };

  handleObjectMouseOut = (e) => {
    this.hideTooltipObjectInfo(e);
  };

  render() {
    const { object, setColor } = this.props;
    const { isPointed, objectIcon } = this.state;
    
    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
        draggable={false}
        onClick={this.handleObjectClick}
        onContextMenu={this.handleObjectContextMenu}
        onMouseEnter={this.handleObjectMouseMove}
        onMouseLeave={this.handleObjectMouseOut}
        name="object"
        nameID={object.id}
      >
        <Rect
          width={object.width}
          height={object.height}
          fill={setColor(object.id, object.hasIntersection, object.color)}
          opacity={isPointed ? 0.5 : 1}
          stroke="black"
          strokeWidth={0.5}
          // shadowColor={'black'}
          // shadowBlur={2}
          // shadowOffset={{x : 1, y : 1}}
          // shadowOpacity={0.4}
        />
        {objectIcon}
      </Group>
    );
  }
}
