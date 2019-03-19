import React from 'react';
import { Rect, Group, Path, Wedge } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';
import { SELECTED_COLOR, EMPTY_TABLE_COLOR, WARNING_COLOR } from '../../../res/constantsObjectsColors';
import { LEFT_SIDE, BOTTOM_SIDE, RIGHT_SIDE, TOP_SIDE } from '../../../res/constantsTableSeat';

export default class MovableObject extends React.PureComponent {
  constructor(props) {
    super(props);

    const { object } = props;

    this.state = {
      objectIcon: this.drawIcon(object),
      isPointed: false,
      isDragging: false
    };
  }

  componentDidMount() {
    const { checkHasIntersection, object } = this.props;
    checkHasIntersection(object);
  }

  componentDidUpdate(prevProps) {
    const { checkHasIntersection, object } = this.props;

    // проверим границы для измененного объекта:
    // будем проверять границы при каждом изменении размеров и координат объекта:
    if (prevProps.object.width !== object.width 
        || prevProps.object.height !== object.height 
        || prevProps.object.coordinates.x !== object.coordinates.x 
        || prevProps.object.coordinates.y !== object.coordinates.y
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

    // если объект перетаскивают, то isPointed - неактивен
    const { isDragging } = this.state; 
    this.setState({
      isPointed: !isDragging,
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
  handleObjectDragStart = (e) => {
    const { hideContextMenu, object, setCurrentObject } = this.props;

    // объект в состоянии перетаскивания:
    this.setState({
      isDragging: true
    });

    // выведем объект на передний план:
    e.currentTarget.moveToTop();

    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    setCurrentObject(object.id, userId);
    hideContextMenu();
  };

  handleObjectDragEnd = (e) => {
    const { showShadow, stopShadow, setCurrentObject, blockSnapSize, object } = this.props;

    const { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
    e.currentTarget.position({
      x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
      y: Math.round(checkedY / blockSnapSize) * blockSnapSize,
    });

    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]);
    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    setCurrentObject(object.id, userId);

    stopShadow();

    // объект не перетаскивают:
    this.setState({
      isDragging: false
    });
  };

  handleObjectDragMove = (e) => {
    const { showShadow, object } = this.props;

    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]);
    this.showTooltipObjectInfo(e);
  };

  handleObjectClick = (e) => {
    // всегда сообщаем id объекта:
    const { setCurrentObject, object } = this.props;

    // обработка информации о пользователе:
    const userId = object.userId === undefined ? '' : object.userId;
    setCurrentObject(object.id, userId);

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

  setSeatForTable = () => {
    const { object } = this.props;
    let seatTableSettings = {};
    switch (object.seatLocation) {
      case LEFT_SIDE:
        seatTableSettings.xSeat = 0;
        seatTableSettings.ySeat = object.height / 2;
        seatTableSettings.rotSeat = -90; 
        seatTableSettings.seatSize = object.height / 3;
        break;
      case BOTTOM_SIDE:
        seatTableSettings.xSeat = object.width / 2;
        seatTableSettings.ySeat = object.height;
        seatTableSettings.rotSeat = 180; 
        seatTableSettings.seatSize = object.width / 3;
        break;
      case RIGHT_SIDE:
        seatTableSettings.xSeat = object.width;
        seatTableSettings.ySeat = object.height / 2;
        seatTableSettings.rotSeat = 90; 
        seatTableSettings.seatSize = object.height / 3;
        break;
      case TOP_SIDE:
        seatTableSettings.xSeat = object.width / 2;
        seatTableSettings.ySeat = 0;
        seatTableSettings.rotSeat = 0; 
        seatTableSettings.seatSize = object.width / 3;
        break;
      default:
        break;
    }
    return seatTableSettings;
  }

  setOrientationForMovables = () => {
    const { object } = this.props;
    let orientationSettings = {};

    let highlightThikness = 5;

    switch (object.orientation) {
      case LEFT_SIDE:
        orientationSettings.x = 0;
        orientationSettings.y = object.height / 2;
        orientationSettings.size = highlightThikness;
        orientationSettings.rotCrack = -90;
        orientationSettings.highlightRect = (
          <Rect
            width={highlightThikness}
            height={object.height}
            fill="black"
            opacity={0.5}
          />
        );
        break;
      case BOTTOM_SIDE:
        orientationSettings.x = object.width / 2;
        orientationSettings.y = object.height; 
        orientationSettings.size = highlightThikness;
        orientationSettings.rotCrack = 180;
        orientationSettings.highlightRect = (
          <Rect
            y={object.height - highlightThikness}
            width={object.width}
            height={highlightThikness}
            fill="black"
            opacity={0.5}
          />
        );
        break;
      case RIGHT_SIDE:
        orientationSettings.x = object.width;
        orientationSettings.y = object.height / 2;
        orientationSettings.size = highlightThikness;
        orientationSettings.rotCrack = 90;
        orientationSettings.highlightRect = (
          <Rect
            x={object.width - highlightThikness}
            width={highlightThikness}
            height={object.height}
            fill="black"
            opacity={0.5}
          />
        );
        break;
      case TOP_SIDE:
        orientationSettings.x = object.width / 2;
        orientationSettings.y = 0;
        orientationSettings.size = highlightThikness;
        orientationSettings.rotCrack = 0; 
        orientationSettings.highlightRect = (
          <Rect
            width={object.width}
            height={highlightThikness}
            fill="black"
            opacity={0.5}
          />
        );
        break;
      default:
        break;
    }
    return orientationSettings;
  }

  render() {
    const { object, isSelected } = this.props;
    const { isPointed, objectIcon } = this.state;
    const selectionColor = this.setSelection(isSelected);

    const paddingSelection = 5;
    const seat = object.category === 'table' ? this.setSeatForTable() : undefined;
    const orientation = ['cupboard', 'printer', 'scaner', 'shredder'].includes(object.category) ? this.setOrientationForMovables() : undefined;

    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
        draggable
        onDragStart={this.handleObjectDragStart}
        onDragEnd={this.handleObjectDragEnd}
        onDragMove={this.handleObjectDragMove}
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
          strokeWidth={0.2}
          
          shadowColor="black"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
          shadowOpacity={0.4}
        />
        {/* Место, где сидит работник */}
        { object.category === 'table' 
          && (
          <Wedge
            x={seat.xSeat}
            y={seat.ySeat}
            fill="white"
            // opacity={0.5}
            radius={seat.seatSize}
            angle={180}
            rotation={seat.rotSeat}
            // stroke="black"
            // strokeWidth={0.5}
          />)
        }
        {/* Передняя часть объекта */}
        { ['cupboard', 'printer', 'scaner', 'shredder'].includes(object.category)
          && (
          <React.Fragment>
            {orientation.highlightRect}
            {/* <Wedge
              x={orientation.x}
              y={orientation.y}
              fill={this.setColor()}
              radius={orientation.size}
              angle={90}
              rotation={orientation.rotCrack}
            /> */}
          </React.Fragment>)
        }
        <Rect
          x={paddingSelection}
          y={paddingSelection}
          width={object.width - paddingSelection * 2}
          height={object.height - paddingSelection * 2}
          fill={this.setColor()}
          opacity={isPointed ? 0.5 : 1}
        />
        { object.category !== 'table' && objectIcon }    
      </Group>
    );
  }
}
