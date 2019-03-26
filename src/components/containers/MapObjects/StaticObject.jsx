import React from 'react';
import { Rect, Group, Path, Wedge } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';
import { SELECTED_COLOR, EMPTY_TABLE_COLOR, WARNING_COLOR } from '../../../res/constantsObjectsColors';
import { LEFT_SIDE, BOTTOM_SIDE, RIGHT_SIDE, TOP_SIDE } from '../../../res/constantsOrientation';

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
    const { object, checkHasIntersection } = this.props;

    // проверим границы для измененного объекта:
    // будем проверять границы при каждом изменении размеров и координат объекта:
    if (prevProps.object.width !== object.width 
        || prevProps.object.height !== object.height
        || prevProps.object.category !== object.category) {
      checkHasIntersection(object);
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
    e.target.getStage().container().style.cursor = 'pointer';
    this.showTooltipObjectInfo(e);
  };

  handleObjectMouseOut = (e) => {
    e.target.getStage().container().style.cursor = 'default';
    this.hideTooltipObjectInfo(e);
  };

  // цвет объекта и выделение:
  setColor = () => {
    const { object } = this.props;

    let chosenColor = object.color;
    // если userId определено и пусто, то это стол без пользователя:
    if (object.userId !== undefined && object.userId === '') {
      chosenColor = EMPTY_TABLE_COLOR;
    }
    return object.hasIntersection ? WARNING_COLOR : chosenColor; 
  };

  setSelection = (isSelected) => {
    return isSelected ? SELECTED_COLOR : this.setColor();
  }

  setDoorForObject = () => {
    const { object } = this.props;
    let doorSettings = { ...object.doorPosition };

    switch (object.doorLocation) {
      case LEFT_SIDE:
        doorSettings.rotDoor = -90; 
        doorSettings.size = 25;
        break;
      case BOTTOM_SIDE:
        doorSettings.rotDoor = 180; 
        doorSettings.size = 25;
        break;
      case RIGHT_SIDE:
        doorSettings.rotDoor = 90; 
        doorSettings.size = 25;
        break;
      case TOP_SIDE:
        doorSettings.rotDoor = 0; 
        doorSettings.size = 25;
        break;
      default:
        break;
    }
    return doorSettings;
  }

  render() {
    const { object, isSelected } = this.props;
    const { isPointed, objectIcon } = this.state;

    const door = object.category !== 'construction' ? this.setDoorForObject() : undefined;
    
    // Выделение:
    const selectionColor = this.setSelection(isSelected);
    const paddingSelection = 5;
    const baseAreraSize = {
      width: object.width - paddingSelection * 2, 
      height: object.height - paddingSelection * 2
    };

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
        {/* Область выделения объекта: */}
        <Rect
          width={object.width}
          height={object.height}
          fill={selectionColor}
          opacity={isPointed ? 0.5 : 1}
          stroke="black"
          strokeWidth={0.5}
        />
        {/* Вход */}
        { object.category !== 'construction' && object.doorLocation !== undefined
          && (
          <Wedge
            x={door.x}
            y={door.y}
            opacity={0.5}
            fill="black"
            radius={door.size}
            angle={180}
            rotation={door.rotDoor}
            // stroke="black"
            // strokeWidth={0.5}
          />)
        }
        <Rect
          x={paddingSelection}
          y={paddingSelection}
          width={baseAreraSize.width < 0 ? 0 : baseAreraSize.width}
          height={baseAreraSize.height < 0 ? 0 : baseAreraSize.height}
          fill={this.setColor()}
          opacity={isPointed ? 0.5 : 1}
        />
        {objectIcon}
      </Group>
    );
  }
}
