import * as React from 'react';
import { Stage, Layer, Rect, Text, Label, Tag } from 'react-konva';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  changeBoardState,
  changeMapLevel,
  changeObjectsLevel,
  moveObject,
  changeCurrentObject,
  changeCurrentUser,
  changeCurrentObjectState,
  setHasIntersection,
  shiftObjects,
} from '../../../actions/index';

import MovableObject from '../MapObjects/MovableObject';
import StaticObject from '../MapObjects/StaticObject';
import StaticCompoundObject from '../MapObjects/StaticCompoundObject';
import MovableCompoundObject from '../MapObjects/MovableCompoundObject';
import KonvaGridLayer from '../../presentational/KonvaGridLayer/index';
import MapShape from '../MapShape/index';

// popup:
import PopoverContainer from '../PopoverContainer/index';
import { MULTI_EDIT, SINGLE_EDIT } from '../../../res/workModeConstants';

// загрузить lodash:
const _ = require('lodash');

class AdvancedBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedObjectPos: [10, 10],
      selectedObjectSizes: [10, 10],
      shadowOpacity: 0,

      contextMenuPos: [10, 10],
      contextMenuShow: false,
    };
  }

  // УПРАВЛЕНИЕ СОБЫТИЯМИ НА KONVA STAGE: --------------------------------------
  // 1. СДВИГ И МАСШТАБ---------------------------------------------------------------:
  // 1.1. Фиксируем данные по сдвигу в redux:
  handleStageShiftChange = (shift) => {
    const { boardState } = this.props;
    if (boardState.shift[0] !== shift[0] 
         || boardState.shift[1] !== shift[1]) { 
      // заносим данные в redux:
      const { actions } = this.props;
      const newState = { ...boardState, shift };

      actions.changeBoardState(newState);
    }
  };

  // 1.2. Масштабируем сцену и фиксируем данные в redux:
  handleStageScaleChange = (scale) => {
    // заносим данные в redux:
    const { actions, boardState } = this.props;
    const newState = { ...boardState, scale };

    actions.changeBoardState(newState);
  };

  // 2. ОБРАБОТКА ПЕРЕСЕЧЕНИЙ---------------------------------------------------------------:
  // 2.1. Простая функция обработки пересечений двух прямоугольников вида:
  // { x: number, y: number, width: number, height: number }
  // возвращает true - если пересекаются, false - иначе
  haveIntersection(r1, r2) {
    return !(
      r2.x >= r1.x + r1.width 
      || r2.x + r2.width <= r1.x 
      || r2.y >= r1.y + r1.height
      || r2.y + r2.height <= r1.y
    );
  }

  // 2.2. Функция проверяет текущий объект сцены:
  // если пересекается с границами карты или объектами, то hasIntersection = true
  // иначе  - hasIntersection = false
  checkObjectHasIntersection = (object) => {
    // получить координаты текущего объекта:
    let currObjects;
    // добавляем проверку на compound, теперь есть составные объекты:
    if (object.isCompound) { // если объект составной:
      currObjects = object.composition;
    } else { // если объект не составной:
      currObjects = [
        {
          x: object.coordinates.x,
          y: object.coordinates.y,
          width: object.width,
          height: object.height,
        }
      ];
    }

    const { objects, mapState } = this.props;
    const thisLevelObjects = objects.levels[objects.mapLevel];

    // проверяем, есть ли хотя бы 1 пересечение с объектами (nodes) карты:
    const intersectedWithMapObjects = thisLevelObjects.some((obj) => {
      // если id равен id текущего объекта,
      // то пересечения с этим узлом нет
      if (obj.id === object.id) {
        return false;
      }

      // опять же берем объект и смотрим, вдруг он compound:
      let nextObjects;
      if (obj.isCompound) {
        nextObjects = obj.composition;
      } else { // если объект составной: то у нас несколько объектов:
        nextObjects = [
          {
            x: obj.coordinates.x,
            y: obj.coordinates.y,
            width: obj.width,
            height: obj.height
          }
        ];
      }

      return nextObjects.some((nextObject) => {
        return currObjects.some((currObject) => this.haveIntersection(nextObject, currObject));
      });
    });

    // проверяем, есть ли хотя бы 1 пересечение с областями-границами (borderArea) карты:
    const mapCovering = mapState.description[mapState.level].covering;
    const boundariesOverstepped = mapCovering.some((borderArea) => {
      const borderAreaCoords = borderArea.split(' ', 4).map(v => Number(v));
      // получить координаты и размеры текущей области-границы:
      const currBorder = {
        x: borderAreaCoords[0],
        y: borderAreaCoords[1],
        width: borderAreaCoords[2] - borderAreaCoords[0],
        height: borderAreaCoords[3] - borderAreaCoords[1]
      };

      return currObjects.some((currObject) => this.haveIntersection(currBorder, currObject));
    });

    const hasIntersection = intersectedWithMapObjects || boundariesOverstepped;
    const { actions } = this.props;
    const newLocData = { 
      id: object.id, 
      hasIntersection
    };
    
    actions.setHasIntersection(newLocData);
  };

  checkCurrentObjectHasIntersection = () => {
    const { currentObject, objects } = this.props;
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const objectIds = currentObject.objectId.split(' ');
    thisLevelObjects.forEach(elem => {
      if (objectIds.includes(elem.id)) {
        this.checkObjectHasIntersection(elem);
      }
    });
  };

  // 3. ОБРАБОТКА СОБЫТИЙ STAGE---------------------------------------------------------------:
  handleStageDragStart = () => {
    this.hideContextMenu();
  };

  handleStageDragEnd = (e) => {
    // получим текущие координаты сцены и текущего объекта:
    const currObj = e.target;
    const currentStage = e.currentTarget;

    // если сдвинулась сцена:
    if (currentStage.x() === currObj.x() && currentStage.y() === currObj.y()) {
      this.handleStageShiftChange([currentStage.x(), currentStage.y()]);
    } 
  };

  handleStageWheel = (e) => {
    e.evt.preventDefault();

    const { boardState } = this.props;
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 
      ? boardState.scale * scaleBy 
      : boardState.scale / scaleBy;

    this.handleStageScaleChange(newScale);
  };

  handleStageClick = e => {
    // т.к. для каждый объект - группа,
    // каждая группа имеет имя "object"
    // stage ловит объект низкого уровня - rect, line, text
    // то мы можем понять объект это или нет по имени его родительского узла:
    if (e.target.parent === undefined || e.target.parent.attrs.name !== 'object') {
      // если мы поймали не объект,
      // значит щелчко был не на объекте и мы сбрасываем, если есть:
      // контекстное меню и выбранный объект:
      this.flushAll();
    }
  };

  // 4. СВЯЗЬ С REDUX STORE---------------------------------------------------------------:
  // 4.1. Изменить положение объекта (данные объекта)
  changeObjectLocation = (newX, newY) => {
    const { actions, workMode, currentObject, objects } = this.props;

    if (workMode === MULTI_EDIT) {
      // в этом случае нам нужно сделать массовый сдвиг:
      // делать его будем по последнему элементу:
      const mainId = currentObject.objectId.split(' ').slice(-1)[0];

      // найдём координаты элемента:
      const thisLevelObjects = objects.levels[objects.mapLevel];
      const obj = thisLevelObjects.find(val => val.id === mainId);

      // найдём сдвиг:
      const shift = {
        x: newX - obj.coordinates.x,
        y: newY - obj.coordinates.y,
      };

      // и теперь обновим данные в redux:
      const newObjectData = {
        ids: currentObject.objectId,
        shift: shift,
      };
      // новым действием МАССОВЫЙ СДВИГ:
      actions.shiftObjects(newObjectData);
    } 
    
    if (workMode === SINGLE_EDIT) {
      const newObjectData = {
        id: currentObject.objectId,
        pos: {
          x: newX,
          y: newY,
        },
      };

      actions.moveObject(newObjectData);
    }
  };

  // 5. РАБОТА С УКРАШЕНИЕМ ТЕКУЩЕГО ОБЪЕКТА:: ------------------------------------------------
  // 5.1. ТЕНЬ ТЕКУЩЕГО ОБЪЕКТА:: -------------------------------------------------------------
  // 5.1.1. Показать тень (при движении объекта):
  showCurrentObjectShadow = (posX, posY, size) => {
    const { mapState } = this.props;
    const lvl = mapState.level;
    const blockSnapSize = mapState.description[lvl].levelCellSize;
    this.setState({
      selectedObjectPos: [
        Math.round(posX / blockSnapSize) * blockSnapSize,
        Math.round(posY / blockSnapSize) * blockSnapSize,
      ],
      selectedObjectSizes: size,
      shadowOpacity: 1,
    });
  };

  // 5.1.2. Скрыть тень (при остановке движения (drop) объекта):
  hideCurrentObjectShadow = () => {
    // this.changeObjectLocation();
    this.setState({
      shadowOpacity: 0,
    });
  };

  // 5.2. КОНТЕКСТНОЕ МЕНЮ ТЕКУЩЕГО ОБЪЕКТА (СЦЕНЫ):-------------------------------------------
  // 5.2.1. Показать контекстное меню
  showContextMenu = (x, y) => {
    const offset = 5;
    this.setState({
      contextMenuPos: [x + offset, y + offset],
      contextMenuShow: true,
    });
  };

  // 5.2.2. Скрыть контекстное меню
  hideContextMenu = () => {
    this.setState({
      contextMenuShow: false,
    });
  };

  // 5.3. ДОПОЛНИТЕЛЬНО:
  // 5.3.1. Выбор текущего объекта и пользователя (если есть):
  // доп методы для основной функции:
  resetCurrentObject = () => {
    const { actions } = this.props;   
    actions.changeCurrentObject('');
    actions.changeCurrentUser('');
    // при каждом сбросе текущего объекта мы закрываем меню редактирования:
    actions.changeCurrentObjectState('none');
  }

  isThereObjectsSelected = () => {
    const { currentObject } = this.props;
    return currentObject.objectId !== '';
  }

  addObjectToSelectedObjects = (objectId) => {
    const { currentObject } = this.props;
    // получим список id выделенных объектов:
    let currentSelectedObjects = currentObject.objectId.split(' ');
    // нужно добавить новый объект в конец списка
    // проверим, есть переданный objectId уже в данных:
    const indOfObjectId = currentSelectedObjects.indexOf(objectId);
      
    if (indOfObjectId === -1) { // если id объекта нет среди выделенных
      // то добавим его в конец:
      currentSelectedObjects.push(objectId);
      return currentSelectedObjects.join(' ');
    } else { // если id объекта есть среди выделенных
      // то переносим его в конец (по последнему элементу считается сдвиг):
      currentSelectedObjects.splice(indOfObjectId, 1);
      currentSelectedObjects.push(objectId);
      return currentSelectedObjects.join(' '); 
    }
  }

  addObjectIdToCurrentObjectId = (objectId) => {
    let newObjectId;  
    // передаваемый параметр objectId !== '' (для этой функции - это 100%):
    
    if (this.isThereObjectsSelected()) { // если уже есть выделенные объекты: 
      newObjectId = this.addObjectToSelectedObjects(objectId);
    } else { // если других объектов не было выделено до этого:
      newObjectId = objectId;
    }
  
    return newObjectId;
  }

  changeCurrentObjectInSingleEditMode = (objectId, userId) => {
    const { actions } = this.props;
    actions.changeCurrentObject(objectId);
    actions.changeCurrentUser(userId);
  } 

  changeCurrentObjectInMultiEditMode = (objectId) => {
    const { actions } = this.props;

    let newObjectId = this.addObjectIdToCurrentObjectId(objectId);     
    actions.changeCurrentObject(newObjectId);
    actions.changeCurrentUser('');
  } 

  setCurrentObject = (objectId, userId) => {
    // изменим текущий объект для redux:
    const { workMode } = this.props;

    switch (workMode) {
      case SINGLE_EDIT:
        this.changeCurrentObjectInSingleEditMode(objectId, userId);
        break;
      case MULTI_EDIT:
        this.changeCurrentObjectInMultiEditMode(objectId);
        break;
      default:
        break;
    }
  };

  // 5.3.2. Сброс объекта и контекстного меню (для popover и konvaGrid):
  flushAll = () => {
    this.hideContextMenu();
    this.resetCurrentObject();
  };

  // 5.3.3. Открыть вкладку "Редактировать"
  openCurrentObjectTab = () => {
    const { actions, workMode } = this.props;
    if (workMode !== MULTI_EDIT) {
      actions.changeCurrentObjectState('edit');
    }
  };

  render() {
    const { boardWidth, boardHeight, objects, users, mapState, boardState } = this.props;

    // данные для тени:
    const { selectedObjectPos, selectedObjectSizes, shadowOpacity } = this.state;
    // данные для контекстного меню:
    const { contextMenuShow, contextMenuPos } = this.state;
    // данные для сетки (KonvaGrid):
    const lvl = mapState.level;
    const { levelMapWidth, levelMapHeight, levelCellSize, boundaries, covering } = mapState.description[lvl];
    
    // данные по текущему объекту:
    const { currentObject } = this.props;
    const selectedObjects = currentObject.objectId.split(' ');

    // загрузить объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const loadObject = thisLevelObjects.map((elem) => {
      // здесь нужно глубокое копирование:
      const object = _.cloneDeep(elem);
      if (object.movable) {
        // если у объекта нет свойства userId, то искать ничего не нужно:
        let currUser = {};
        if (object.userId !== undefined) {
          currUser = users.find(user => user.id === object.userId);
        }

        if (object.isCompound) {
          return (
            <MovableCompoundObject
              key={object.id}
              object={object}
              user={currUser}
              isSelected={selectedObjects.includes(object.id)}
              mapWidth={levelMapWidth}
              mapHeight={levelMapHeight}
              blockSnapSize={levelCellSize}
              showShadow={this.showCurrentObjectShadow}
              stopShadow={this.hideCurrentObjectShadow}
              showContextMenu={this.showContextMenu}
              hideContextMenu={this.hideContextMenu}
              setCurrentObject={this.setCurrentObject}
              changeObjectLocation={this.changeObjectLocation}
              checkHasIntersection={this.checkObjectHasIntersection}
              openCurrentObjectTab={this.openCurrentObjectTab}
            />
          );
        } else {
          return (
            <MovableObject
              key={object.id}
              object={object}
              user={currUser}
              isSelected={selectedObjects.includes(object.id)}
              mapWidth={levelMapWidth}
              mapHeight={levelMapHeight}
              blockSnapSize={levelCellSize}
              showShadow={this.showCurrentObjectShadow}
              stopShadow={this.hideCurrentObjectShadow}
              showContextMenu={this.showContextMenu}
              hideContextMenu={this.hideContextMenu}
              setCurrentObject={this.setCurrentObject}
              changeObjectLocation={this.changeObjectLocation}
              checkHasIntersection={this.checkObjectHasIntersection}
              openCurrentObjectTab={this.openCurrentObjectTab}
            />
          );
        }
      } 
      if (!object.movable) {
        if (object.isCompound) {
          return (
            <StaticCompoundObject
              key={object.id}
              object={object}
              isSelected={selectedObjects.includes(object.id)}
              showContextMenu={this.showContextMenu}
              hideContextMenu={this.hideContextMenu}
              setCurrentObject={this.setCurrentObject}
              checkHasIntersection={this.checkObjectHasIntersection}
              openCurrentObjectTab={this.openCurrentObjectTab}
            />
          );
        } else {
          return (
            <StaticObject
              key={object.id}
              object={object}
              isSelected={selectedObjects.includes(object.id)}
              showContextMenu={this.showContextMenu}
              hideContextMenu={this.hideContextMenu}
              setCurrentObject={this.setCurrentObject}
              checkHasIntersection={this.checkObjectHasIntersection}
              openCurrentObjectTab={this.openCurrentObjectTab}
            />
          );
        }
      }
      return undefined;
    });

    return (
      <div
        style={{
          border: '1px solid black',
        }}
      >
        <Stage
          x={boardState.shift[0]}
          y={boardState.shift[1]}
          width={boardWidth}
          height={boardHeight}
          draggable
          onWheel={this.handleStageWheel}
          scale={{
            x: boardState.scale,
            y: boardState.scale,
          }}
          onDragStart={this.handleStageDragStart}
          onDragEnd={this.handleStageDragEnd}
          onDblClick={this.handleStageDblClick}
          onClick={this.handleStageClick}
        >
          <KonvaGridLayer
            width={levelMapWidth}
            height={levelMapHeight}
            blockSnapSize={levelCellSize}
            boundaries={boundaries}
            flushAll={this.flushAll}
          />
          <Layer>
            {/* Shadow is here: */}
            <Rect
              x={selectedObjectPos[0]}
              y={selectedObjectPos[1]}
              width={selectedObjectSizes[0]}
              height={selectedObjectSizes[1]}
              fill="#FFC300" // "#AE4C01"
              opacity={shadowOpacity}
              stroke="#823B04" // "#823B04"
              strokeWidth={0.3}
            />
            <MapShape boundaries={boundaries} borderlands={covering} />
            {loadObject}
          </Layer>
          {/* Еще один слой для tooltip: */}
          <Layer>
            <Label opacity={0.75} visible={false} listening={false}>
              <Tag
                fill="#5059DD"
                pointerDirection="down"
                pointerWidth={Math.floor(10 / boardState.scale)}
                pointerHeight={Math.floor(10 / boardState.scale)}
                lineJoin="round"
                shadowColor="black"
                shadowBlur={10}
                shadowOffset={10}
                shadowOpacity={0.8}
              />
              <Text
                text=""
                fontFamily="Arial"
                fontSize={Math.floor(16 / boardState.scale)}
                padding={Math.floor(5 / boardState.scale)}
                fill="white"
                name="objectTooltip"
              />
            </Label>
          </Layer>
        </Stage>
        {/* Context menu for the current object is here: */}
        {contextMenuShow && (
          <PopoverContainer
            x={contextMenuPos[0]}
            y={contextMenuPos[1]}
            readyHandler={this.flushAll}
          />
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  users: state.users,
  boardState: state.boardState,
  mapState: state.mapState,
  currentObject: state.currentObject,
  workMode: state.workMode,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      changeBoardState,
      changeMapLevel,
      changeObjectsLevel,
      moveObject,
      changeCurrentObject,
      changeCurrentUser,
      changeCurrentObjectState,
      setHasIntersection,
      shiftObjects,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdvancedBoard);
