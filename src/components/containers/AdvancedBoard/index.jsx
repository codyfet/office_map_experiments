import * as React from "react";
import { Stage, Layer, Group, Rect, Text } from "react-konva";
import RectObject from "../../RectObject";
import KonvaGridLayer from "../../presentational/KonvaGridLayer/index";
import MapShape from "../MapShape/index";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeBoardState, changeMapLevel, changeObjectsLevel, moveObject } from "../../../actions/index";

//popup:
import PopoverContainer from "../PopoverContainer/index";

// статические данные карты:
import mapData from "../../../res/mapData.json";
import { DEFAULT_COLOR, WARNING_COLOR, SELECTED_COLOR } from '../../../res/constantsObjectsColors';

class AdvancedBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      selectedObjectId: -1,
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
  handleStageScaleChange = (e, newScale) => {
    // масштабируем сцену
    const stage = e.target.getStage();
    stage.scale({ x: newScale, y: newScale });

    // заносим данные в redux:
    const { actions } = this.props;
    const newState = Object.assign({}, this.props.boardState);
    newState.scale = newScale;

    actions.changeBoardState(newState);

  }

  // 1.3. Авто-подстройка масштаба и сдвига под границы stage:
  autoAdjustStage = (e, mapWidth, mapHeight) => {

    // получаем границы окна:
    const { width, height } = this.props;

    // настраиваем масштаб:
    let scaleX = width / mapWidth;
    let scaleY = height / mapHeight;
    const newScale = scaleX > scaleY ? scaleX : scaleY;

    this.handleStageScaleChange(e, newScale);

    // возвращаем сдвиг в первоначальное положение:
    this.handleStageShiftChange([0, 0]);


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

  // 2.2. Функция проверяет текущий объект сцены
  // И подсвечивает объект красным, если он:
  // - выходит за границы карты (пересекается с граничными областями - borderlands)
  // - пересекается с объектами внутри карты
  // иначе:
  // - подсвечивает объект цветом по-умолчанию
  checkIntersection = (currentStage, currentObject) => {

    // сейчас за пересечение берутся координаты float движимого объекта
    // однако, можно воспользоваться и координатами тени (если потребуется)

    // получить координаты текущего объекта:
    let currObject = {
      x: currentObject.attrs.x,
      y: currentObject.attrs.y,
      width: currentObject.children[0].attrs.width,
      height: currentObject.children[0].attrs.height
    };

    // проверяем, есть ли хотя бы 1 пересечение с объектами (nodes) карты:
    let intersectedWithMapObjects = currentStage.children[1].children.some((node, i) => {
      // если узел - не группа, индекс меньше 2 или равен текущему объекту 
      // то пересечения с этим узлом нет
      if ( node.nodeType !== "Group" || node === currentObject || i < 2 ) {
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
    let boundariesOverstepped = currentStage.children[1].children[1].children.some((border, i) => {
      
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

    //!!! ЛОГИКА СЛЕДУЮЩИХ ДЕЙСТВИЙ НЕРАЗРЫВНО СВЯЗАНА С 
    // ВЫДЕЛЕНИЕМ ОБЪЕКТА В RectObject:
    
    // залить цветом прямоугольник данного объекта:
    let rect = currentObject.children[0];

    // сначала проверим, пересекается ли объект с границами или другим объектом:
    if ( intersectedWithMapObjects || boundariesOverstepped ) {
      // сначала сохраним данные о цвете, причем если элемент сейчас предупреждающего цвета,
      // то данные переписывать не нужно:
      rect.prevFill = rect.fill === WARNING_COLOR ? rect.prevFill : rect.fill;
      // в этом случае закрашиваем предупреждающим цветом (даже если объект выделен):
      rect.fill(WARNING_COLOR);
    } else {
      // иначе - проверим текущий цвет объекта
      // если цвет для выделения, то мы должны его оставить:
      if ( rect.attrs.fill === SELECTED_COLOR ) {
        rect.fill(SELECTED_COLOR);
      } else if ( rect.attrs.fill === WARNING_COLOR ) { //если объект был красного цвета, а сейчас все норм
        // то закрасим предыдущим цветом, но не WARNING_COLOR:
        if ( rect.attrs.prevFill === WARNING_COLOR ) {
          rect.fill(DEFAULT_COLOR);
        } else {
          rect.fill(rect.attrs.prevFill);
        }
        
      }
    }
    
  };

  // 3. ОБРАБОТКА СОБЫТИЙ STAGE---------------------------------------------------------------:
  onStageDragStart = (e) => {

    this.hideContextMenu();
  }

  onStageDragMove = (e) => {
    // если потребуется проверка пересечений при передвижении объекта:
    // this.checkIntersection(e.currentTarget, e.target);
  }
  
  onStageDragEnd = (e) => {
    // for debugging:
    // console.log( "coords for the moved stage:", e.currentTarget.x(), e.currentTarget.y() );
    // console.log( "coords for the moved object:", e.target.x(), e.target.y() );
    // console.log( "interesting:", e);

    // получим текущие координаты сцены и текущего объекта:
    let currentObject = e.target;
    let currentStage = e.currentTarget;

    // если сдвинулась сцена:
    if ( currentStage.x() === currentObject.x() && currentStage.y() === currentObject.y() ) {

      this.handleStageShiftChange( [currentStage.x(), currentStage.y()] );
    
    } else { 
      // если свдинулся объект:
      this.checkIntersection(currentStage, currentObject);
    }
  
  };

  onStageWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const oldScale = e.target.getStage().scaleX();
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    this.handleStageScaleChange(e, newScale);

  }
 
  onStageDblClick = (e) => { 
    //границы карты:
    const { mapWidth, mapHeight } = this.props.mapState;
    // padding:
    const padding = 20;

    this.autoAdjustStage(e, mapWidth + padding, mapHeight + padding);

  }

  onStageContextMenu = (e) => {
    e.evt.preventDefault();
    this.showContextMenu(e.evt.clientX, e.evt.clientY);
    console.log('contextmenu', e);
  }

  // 4. СВЯЗЬ С REDUX STORE---------------------------------------------------------------:
  // 4.1. Изменить положение объекта (данные объекта)
  objectDataToRedux = () => {
    const { actions } = this.props;
    let newObjectData = {
      id: this.state.selectedObjectId,
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
    // const { scale, shift } = this.props.boardState;
    // let coords = [
    //   Math.floor(x * scale + shift[0]) + shiftToWindow.x, //x
    //   Math.floor(y * scale + shift[1]) + shiftToWindow.y - 50 //y
    // ];

    this.setState({
      // selectedObjectPos: coords,
      contextMenuPos: [ x + 5, y + 5],
      contextMenuShow: true
    });

  };

  // 5.2.2. Скрыть контекстное меню
  hideContextMenu = () => {
    this.setState({
      contextMenuShow: false
    });

    // при закрытии контекстного меню, 
    // мы должны обнулить id объекта для SidePanel:
    const { changeSelectedObjectId } = this.props;
    changeSelectedObjectId('');

  };

  // 5.3. ДОПОЛНИТЕЛЬНО:
  // 5.3.1. Выбор текущего объекта:
  setCurrentObjectId = (id) => {
    
    // изменим выбранный объект для AdvancedBoard:
    this.setState({
      selectedObjectId: id
    });

    // изменим выбранный объект для GlobalArea:
    const { changeSelectedObjectId } = this.props;
    changeSelectedObjectId(this.state.selectedObjectId);

  };

  

  render() {
    const { width, height, objects, users } = this.props;
    
    // settings for map (KonvaGrid):
    const { mapWidth, mapHeight, blockSnapSize, mapBoundaries, mapCovering } = this.props.mapState; 

    const loadObject = objects.map((elem, i) => {
      // find userInfo for object:
      let userInfo = users.find( (user) => user.id === elem.userId );
      userInfo = userInfo === undefined ? 'no user' : userInfo.title;

      return (
        <RectObject
          key={i}
          id={elem.id}
          x={elem.coordinates.x}
          y={elem.coordinates.y}
          width={elem.width}
          height={elem.height}
          globalWidth={width - 20}
          globalHeight={height - 20}
          blockSnapSize={blockSnapSize}
          
          showShadow={this.showCurrentObjectShadow}
          stopShadow={this.hideCurrentObjectShadow}

          hideContextMenu={this.hideContextMenu}
          shareId={this.setCurrentObjectId}

          userInfo={userInfo}
          // color={this.state.selectedObjectId === elem.id ? SELECTED_COLOR : DEFAULT_COLOR}

        />
      );
    });

    return (
      <div
        style={{
          border: "1px solid black"
        }}
      >
        <Stage
          x={this.props.boardState.shift[0]}
          y={this.props.boardState.shift[1]}
          
          width={width}
          height={height}
          draggable={true}

          onWheel={this.onStageWheel}
          scaleX={this.props.boardState.scale}
          scaleY={this.props.boardState.scale}

          onDragStart={this.onStageDragStart}
          onDragEnd={this.onStageDragEnd}
          onDragMove={this.onStageDragMove}
          onDblClick={this.onStageDblClick}
          onContentContextMenu={this.onStageContextMenu}

        >
          <KonvaGridLayer
            width={mapWidth}
            height={mapHeight}
            blockSnapSize={blockSnapSize}
            boundaries={mapBoundaries}
          />
          <Layer>
            {/*Shadow is here:*/}
            <Rect
              x={this.state.selectedObjectPos[0]}
              y={this.state.selectedObjectPos[1]}
              width={this.state.selectedObjectSizes[0]}
              height={this.state.selectedObjectSizes[1]}
              fill={"orange"}
              opacity={this.state.shadowOpacity}
              stroke={"#AE4C01"}
              strokeWidth={2}
            />
            <MapShape 
              boundaries={mapBoundaries}
              borderlands={mapCovering}
            />
            {loadObject}
          </Layer>
          {/* Еще один слой для tooltip: */}
          <Layer>
            <Text
              text=""
              fontFamily="Calibri"
              fontSize={12}
              padding={5}
              visible={false}
              fill="black"
              opacity={0.75}
              textFill="white"
              name="objectTooltip"
            />
            
          </Layer> 

        </Stage>
        {/*Context menu for the current object is here:*/}
        {this.state.contextMenuShow && (
          <PopoverContainer
            x={this.state.contextMenuPos[0]}
            y={this.state.contextMenuPos[1]}
            objectId={this.state.selectedObjectId}
            readyHandler={this.hideContextMenu}
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
  mapState: state.mapState
  
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ changeBoardState, changeMapLevel, changeObjectsLevel, moveObject }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedBoard);
