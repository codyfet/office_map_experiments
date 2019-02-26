import React from 'react';
import { Rect, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';

export default class StaticObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPointed: false,
    };
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
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
  onObjectClick = e => {
    // всегда сообщаем id объекта:
    const { shareObjectData, object } = this.props;

    shareObjectData(object.id, object.userId);

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
    // draw a picture:
    let { shiftX, shiftY, scale } = getIconSettings(object);

    const drawIcon = iconPaths[object.category].path.map((path, i) => {
      return (
        <Path
          key={i}
          x={object.width / 2 - shiftX}
          y={object.height / 2 - shiftY}
          data={path}
          fill="black"
          scale={{
            x: scale, // * scaleIncrease,
            y: scale, // * scaleIncrease
          }}
        />
      );
    });

    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
        draggable={false}
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
          fill={setColor(object.id, object.correctLocation, object.color)}
          opacity={isPointed ? 0.5 : 1}
          stroke="black"
          strokeWidth={0.5}
          // shadowColor={'black'}
          // shadowBlur={2}
          // shadowOffset={{x : 1, y : 1}}
          // shadowOpacity={0.4}
        />
        {drawIcon}
      </Group>
    );
  }
}
