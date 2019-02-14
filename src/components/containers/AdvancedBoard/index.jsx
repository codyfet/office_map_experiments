import * as React from "react";
import { Stage, Layer, Group, Rect, Text, Label, Tag } from "react-konva";
import MovableObject from "../MapObjects/MovableObject";
import StaticObject from "../MapObjects/StaticObject";
import KonvaGridLayer from "../../presentational/KonvaGridLayer/index";
import MapShape from "../MapShape/index";
import { DEFAULT_COLOR, EMPTY_TABLE_COLOR, WARNING_COLOR, SELECTED_COLOR } from '../../../res/constantsObjectsColors';

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { 
  changeBoardState, 
  changeMapLevel, 
  changeObjectsLevel, 
  moveObject, 
  changeCurrentObject,
  changeCurrentUser,
  changeCurrentObjectState,
  changeCorrectLocation 

} from "../../../actions/index";

//popup:
import PopoverContainer from "../PopoverContainer/index";

// загрузить lodash:
var _ = require('lodash');



class AdvancedBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      selectedObjectPos: [10, 10],
      selectedObjectSizes: [10, 10],

      contextMenuPos: [10, 10],

      shadowOpacity: 0,

      contextMenuShow: false
    };
  }

  // УПРАВЛЕНИЕ СОБЫТИЯМИ НА KONVA STAGE: --------------------------------------
  // 1. СДВИГ И МАСШТАБ---------------------------------------------------------------:
  // 1.1. Фиксируем данные по сдвигу в redux:
  handleStageShiftChange = (newShift) => {
    if (
      this.props.boardState.shift[0] !== newShift[0] ||
      this.props.boardState.shift[1] !== newShift[1]
    ) {
      // заносим данные в redux: 
      const { actions } = this.props;
      const newState = Object.assign({}, this.props.boardState);
      newState.shift = newShift;

      actions.changeBoardState(newState);
    }
  }

  // 1.2. Масштабируем сцену и фиксируем данные в redux:
  handleStageScaleChange = (newScale) => {
    // заносим данные в redux:
    const { actions } = this.props;
    const newState = Object.assign({}, this.props.boardState);
    newState.scale = newScale;

    actions.changeBoardState(newState);

  }

  // 1.3. Авто-подстройка масштаба и сдвига под границы stage:
  autoAdjustStage = () => {
    // padding:
    const padding = 20;

    // получаем границы карты:
    const { mapWidth, mapHeight } = this.props.mapState;

    // получаем границы окна :
    const { boardWidth, boardHeight } = this.props;

    // настраиваем масштаб:
    // считаем используя отступ с 2-х сторон (поэтому * 2)
    let scaleX = boardWidth / (mapWidth + padding*2);
    let scaleY = boardHeight / (mapHeight + padding*2);

    // если реальная карта больше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY < 1),
    // то выберем наибольший масштаб:
    let newScale;
    if ( scaleX < 1 || scaleY < 1) {
      newScale = scaleX > scaleY ? scaleY : scaleX;
    } else { // иначе:
      newScale = scaleX > scaleY ? scaleX : scaleY;
    }

    // сразу в redux:
    const { actions } = this.props;
    const newState = { 
      shift: [padding*newScale, padding*newScale], 
      scale: newScale            
    };

    actions.changeBoardState(newState);

  };

  // 2. ОБРАБОТКА ПЕРЕСЕЧЕНИЙ---------------------------------------------------------------:
  // 2.1. Простая функция обработки пересечений двух прямоугольников вида:
  // { x: number, y: number, width: number, height: number }
  // возвращает true - если пересекаются, false - иначе
  haveIntersection(r1, r2) {
    return !(
      r2.x >= r1.x + r1.width ||
      r2.x + r2.width <= r1.x ||
      r2.y >= r1.y + r1.height ||
      r2.y + r2.height <= r1.y
    );
  }

  // 2.2. Функция проверяет текущий объект сцены:
  // если пересекается с границами карты или объектами, то correctLocation = false
  // иначе  - correctLocation = true
  checkObjectLocation = (object) => {
    // получить координаты сцены:
    let stage = this.stageRef.getStage();

    // получить координаты текущего объекта:
    let currObject = {
      x: object.coordinates.x,
      y: object.coordinates.y,
      width: object.width,
      height: object.height
    };

    // console.log('checkObjectLocation stage', stage);
    // console.log('checkObjectLocation object', object);

    // проверяем, есть ли хотя бы 1 пересечение с объектами (nodes) карты:
    let intersectedWithMapObjects = stage.children[1].children.some((node, i) => {
      // если узел - не группа, индекс меньше 2 или равен текущему объекту 
      // то пересечения с этим узлом нет
      if ( node.nodeType !== "Group" || node.attrs.nameID === object.id || i < 2 ) {
        return false;
      }

      // получить координаты и размеры текущего узла:
      // реализовано отдельно специально, ведь при масштабировании
      // координаты становятся нецелыми и при проверках возникают ошибки 
      let currNode = {
        x: node.attrs.x,
        y: node.attrs.y,
        width: node.children[0].attrs.width,
        height: node.children[0].attrs.height
      };

      if ( this.haveIntersection(currNode, currObject) ) {
        return true;
      } else {
        return false;
      }
      
    });

    // проверяем, есть ли хотя бы 1 пересечение с областями-границами (borders) карты:
    let boundariesOverstepped = stage.children[1].children[1].children.some((border, i) => {
      
      // индекс первого элемента - это изображение карты
      if ( i < 1 ) return false;

      // получить координаты и размеры текущей области-границы:
      let currBorder = {
        x: border.attrs.x,
        y: border.attrs.y,
        width: border.attrs.width,
        height: border.attrs.height
      };

      if ( this.haveIntersection(currBorder, currObject) ) {
        return true;
      } else {
        return false;
      } 

    });

    // Поменять цвет текущего объекта:
    const { actions } = this.props;
    let newLocData = {
      id: object.id
    };
    if ( intersectedWithMapObjects || boundariesOverstepped ) {
      newLocData.corrLoc = false;
    } else {
      newLocData.corrLoc = true; 
    }
    actions.changeCorrectLocation(newLocData);

    
  }

  checkCurrentObjectLocation = () => {
    const { currentObject, objects } = this.props;
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const obj = thisLevelObjects.find(val => val.id === currentObject.objectId);
      
    this.checkObjectLocation(obj);
  }

  // 3. ОБРАБОТКА СОБЫТИЙ STAGE---------------------------------------------------------------:
  onStageDragStart = (e) => {

    this.hideContextMenu();
  }

  onStageDragMove = (e) => {
    // если потребуется проверка пересечений при передвижении объекта:
    // this.checkCurrentObjectLocation();
  }
  
  onStageDragEnd = (e) => {
    // for debugging:
    // console.log( "coords for the moved stage:", e.currentTarget.x(), e.currentTarget.y() );
    // console.log( "coords for the moved object:", e.target.x(), e.target.y() );
    // console.log( "interesting:", e);

    // получим текущие координаты сцены и текущего объекта:
    let currObj = e.target;
    let currentStage = e.currentTarget;

    // если сдвинулась сцена:
    if ( currentStage.x() === currObj.x() && currentStage.y() === currObj.y() ) {

      this.handleStageShiftChange( [currentStage.x(), currentStage.y()] );
    
    } else { 
      // если свдинулся объект:
      this.checkCurrentObjectLocation();
    }
  
  };

  onStageWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const oldScale = this.props.boardState.scale;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    this.handleStageScaleChange(newScale);

  }
 
  onStageDblClick = (e) => {
    this.autoAdjustStage();

  }

  onStageClick = (e) => {
    // т.к. для каждый объект - группа, 
    // каждая группа имеет имя "object"
    // stage ловит объект низкого уровня - rect, line, text
    // то мы можем понять объект это или нет по имени его родительского узла:
    if (e.target.parent === undefined || e.target.parent.attrs.name !== "object") {
      // если мы поймали не объект,
      // значит щелчко был не на объекте и мы сбрасываем, если есть:
      // контекстное меню и выбранный объект:
      this.flushAll();
    } 
  }
  

  // 4. СВЯЗЬ С REDUX STORE---------------------------------------------------------------:
  // 4.1. Изменить положение объекта (данные объекта)
  objectDataToRedux = () => {
    const { actions } = this.props;
    let newObjectData = {
      id: this.props.currentObject.objectId,
      pos: {
        x: this.state.selectedObjectPos[0],
        y: this.state.selectedObjectPos[1]
      }
    };

    actions.moveObject(newObjectData);
  };

  // 5. РАБОТА С УКРАШЕНИЕМ ТЕКУЩЕГО ОБЪЕКТА:: ------------------------------------------------
  // 5.1. ТЕНЬ ТЕКУЩЕГО ОБЪЕКТА:: -------------------------------------------------------------
  // 5.1.1. Показать тень (при движении объекта):
  showCurrentObjectShadow = (posX, posY, size) => {
    const blockSnapSize = this.props.mapState.blockSnapSize;
    this.setState({
      selectedObjectPos: [
        Math.round(posX / blockSnapSize) * blockSnapSize,
        Math.round(posY / blockSnapSize) * blockSnapSize
      ],
      selectedObjectSizes: size,
      shadowOpacity: 1
    });
  };

  // 5.1.2. Скрыть тень (при остановке движения (drop) объекта):
  hideCurrentObjectShadow = () => {
    this.objectDataToRedux();

    this.setState({
      shadowOpacity: 0
    });
  };

  // 5.2. КОНТЕКСТНОЕ МЕНЮ ТЕКУЩЕГО ОБЪЕКТА (СЦЕНЫ):-------------------------------------------------------------
  // 5.2.1. Показать контекстное меню
  showContextMenu = (x, y) => {

    this.setState({
      contextMenuPos: [ x + 5, y + 5],
      contextMenuShow: true
    });

  };

  // 5.2.2. Скрыть контекстное меню
  hideContextMenu = () => {
    this.setState({
      contextMenuShow: false
    });

  };

  // 5.3. ДОПОЛНИТЕЛЬНО:
  // 5.3.1. Выбор текущего объекта и пользователя (если есть):
  setCurrentObjectData = (objectId, userId) => {
    // изменим текущий объект для redux:
    const { actions } = this.props;
    actions.changeCurrentObject(objectId);
    actions.changeCurrentUser(userId);

    // при каждом изменении пользователя мы закрываем меню редактирования:
    actions.changeCurrentObjectState('none');

  }

  // 5.3.2. Выделение объекта цветом:
  setColor = (id, isLocationCorrect, originalColor, userId) => {
    const { currentObject } = this.props;
    
    let chosenColor = originalColor;

    // если userId определено и пусто, то это стол без пользователя:
    if ( userId !== undefined && userId === '' ) {
      chosenColor = EMPTY_TABLE_COLOR;
    }

    if ( isLocationCorrect ) {
      chosenColor = (currentObject.objectId === id) ? SELECTED_COLOR : chosenColor;
    } else  {
      chosenColor = WARNING_COLOR;
    } 

    return chosenColor;
    
  }

  // 5.3.3. Сброс объекта и контекстного меню (для popover и konvaGrid):
  flushAll = () => {
    this.hideContextMenu();
    this.setCurrentObjectData('', '');

  }


  

  render() {
    const { boardWidth, boardHeight, objects, users, currentObject } = this.props;
    
    // settings for map (KonvaGrid):
    const { mapWidth, mapHeight, blockSnapSize, mapBoundaries, mapCovering } = this.props.mapState; 

    // вынуть объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];
    
    const loadObject = thisLevelObjects.map((elem, i) => {
      // здесь нужно глубокое копирование:
      const object = _.cloneDeep(elem);
      if ( object.movable === true ) {
        // если у объекта нет свойства userId, то искать ничего не нужно:
        let currUser = { };
        if ( object.userId !== undefined ) {
          currUser = users.find( (user) => user.id === object.userId );
        }

        return  (
          <MovableObject
            key={i}
            object={object}
            user={currUser}
            setColor={this.setColor}

            mapWidth={mapWidth}
            mapHeight={mapHeight}
            blockSnapSize={blockSnapSize}
            
            showShadow={this.showCurrentObjectShadow}
            stopShadow={this.hideCurrentObjectShadow}
  
            showContextMenu={this.showContextMenu}
            hideContextMenu={this.hideContextMenu}
          
            shareObjectData={this.setCurrentObjectData}
            checkObjectLocation={this.checkObjectLocation}
  
          />
        );
      } else {
        return (
          <StaticObject
            key={i}
            object={object}
            setColor={this.setColor}

            showContextMenu={this.showContextMenu}
            hideContextMenu={this.hideContextMenu}
          
            shareObjectData={this.setCurrentObjectData}
          />
        );
      }
     
    });

    return (
      <div
        style={{
          border: "1px solid black"
        }}
      >
        <Stage
          ref={ref => { this.stageRef = ref; }} // получим ссылку на stage
          x={this.props.boardState.shift[0]}
          y={this.props.boardState.shift[1]}
          
          width={boardWidth}
          height={boardHeight}
          draggable={true}

          onWheel={this.onStageWheel}
          scale={{ 
            x: this.props.boardState.scale, 
            y: this.props.boardState.scale 
          }}

          onDragStart={this.onStageDragStart}
          onDragEnd={this.onStageDragEnd}
          onDragMove={this.onStageDragMove}
          onDblClick={this.onStageDblClick}
          onClick={this.onStageClick}

        >
          <KonvaGridLayer
            width={mapWidth}
            height={mapHeight}
            blockSnapSize={blockSnapSize}
            boundaries={mapBoundaries}
            flushAll={this.flushAll}
          />
          <Layer>
            {/*Shadow is here:*/}
            <Rect
              x={this.state.selectedObjectPos[0]}
              y={this.state.selectedObjectPos[1]}
              width={this.state.selectedObjectSizes[0]}
              height={this.state.selectedObjectSizes[1]}
              fill={"#AE4C01"}
              opacity={this.state.shadowOpacity}
              stroke={"#823B04"}
              strokeWidth={1}
            />
            <MapShape 
              boundaries={mapBoundaries}
              borderlands={mapCovering}
            />
            {loadObject}
          </Layer>
          {/* Еще один слой для tooltip: */}
          <Layer>
            <Label
              opacity={0.75}
              visible={false}
              listening={false}
            >
              <Tag
                fill='black'
                pointerDirection='down'
                pointerWidth={10}
                pointerHeight={10}
                lineJoin='round'
                shadowColor='black'
                shadowBlur={10}
                shadowOffset={10}
                shadowOpacity={0.2} 
              />
              <Text
                text=""
                fontFamily="Calibri"
                fontSize={Math.floor(14 / this.props.boardState.scale)}
                padding={5}
                fill="white"
                name="objectTooltip"
              />
            </Label>
            
            
          </Layer> 

        </Stage>
        {/*Context menu for the current object is here:*/}
        {this.state.contextMenuShow && (
          <PopoverContainer
            x={this.state.contextMenuPos[0]}
            y={this.state.contextMenuPos[1]}
            readyHandler={this.flushAll}
            checkObjectLocation={this.checkObjectLocation}
          />
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: { mapLevel: state.objects.mapLevel,
             levels: state.objects.levels.slice(0) },
  users: state.users,
  boardState: state.boardState,
  mapState: state.mapState,
  currentObject: state.currentObject
  
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ 
    changeBoardState, 
    changeMapLevel, 
    changeObjectsLevel, 
    moveObject,
    changeCurrentObject,
    changeCurrentUser,
    changeCurrentObjectState,
    changeCorrectLocation    
  }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedBoard);
