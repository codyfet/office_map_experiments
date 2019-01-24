import * as React from "react";
import { Stage, Layer, Group, Rect, Text, Line } from "react-konva";
import TableObject from "../../TableObject";
import KonvaGridLayer from "../../presentational/KonvaGridLayer/index";
import MapShape from "../MapShape/index";
import MapLayer from "../MapLayer/index";
import Portal from "../../Portal";

// redux:
import { connect, Provider } from "react-redux";
import { bindActionCreators } from "redux";
import { changeBoardState, moveObject } from "../../../actions/index";

//popup:
import PopoverContainer from "../PopoverContainer/index";

// статические данные карты:
import mapData from "../../../res/mapData.json";
import { array } from "prop-types";

class AdvancedBoard extends React.Component {
  constructor(props) {
    super(props);

    const startLvl = 1;

    this.state = {
      mapLevel: startLvl,
      blockSnapSize: mapData.levels[startLvl].levelCellSize,
      mapWidth: mapData.levels[startLvl].levelMapWidth,
      mapHeight: mapData.levels[startLvl].levelMapHeight,
      mapBoundaries: mapData.levels[startLvl].boundaries,
      mapCovering: mapData.levels[startLvl].covering,

      stageScale: 1,
      stageX: 0,
      stageY: 0,
      stageShift: [0, 0],

      selectedObjectId: -1,
      selectedObjectPos: [10, 10],
      selectedObjectSizes: [10, 10],

      shadowOpacity: 0,

      contextMenuShow: false
    };
  }

  // управление сценой konva: --------------------------------------
  // сдвиг и масштаб
  handleWheel = e => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    this.setState({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });

    this.stageStateToRedux();
  };

  // следим за сценой:
  handleStopMoving = e => {
    // console.log( "coords for the moved stage:", e.currentTarget.x(), e.currentTarget.y() );
    // console.log( "coords for the moved object:", e.target.x(), e.target.y() );
    console.log( "interesting:", e);

    this.showIntersection(e.currentTarget, e.target);

    const newShift = [e.currentTarget.x(), e.currentTarget.y()];
    if (
      this.state.stageShift[0] !== newShift[0] ||
      this.state.stageShift[1] !== newShift[1]
    ) {
      this.setState({
        stageShift: [e.currentTarget.x(), e.currentTarget.y()]
      });
      this.stageStateToRedux();
    }
  };

  // следим, чтобы объект не вышел за границы:
  // функция-оповещатель выхода за границы:
  showIntersection = (currentStage, currentObject) => {
    function haveIntersection(r1, r2) {
      return !(
        r2.x >= r1.x + r1.width ||
        r2.x + r2.width <= r1.x ||
        r2.y >= r1.y + r1.height ||
        r2.y + r2.height <= r1.y
      );
    }

    // если двинулась сцена: нчиего не делаем
    if (
      currentStage.x() === currentObject.x() &&
      currentStage.y() === currentObject.y()
    ) {
      return;
    }

    // получить координаты текущей ноды:
    let nodeCurr = {
      x: currentObject.attrs.x,
      y: currentObject.attrs.y,
      width: currentObject.children[0].attrs.width,
      height: currentObject.children[0].attrs.height
    };

    let intersected = currentStage.children[1].children.some((node, i) => {
      // do not check intersection with itself or with strange lines!
      if ( node.nodeType !== "Group" || node === currentObject || i < 2 ) {
        return false;
      }

      // получить текущие координаты и размеры:
      let nodeR = {
        x: node.attrs.x,
        y: node.attrs.y,
        width: node.children[0].attrs.width,
        height: node.children[0].attrs.height
      };

      // console.log("interestCheck", nodeR);

      if (haveIntersection(nodeR, nodeCurr)) {
        // node.findOne(".right").fill("red");
        //node.findOne('.right').name('')
        // console.log("intersection:", nodeR, nodeCurr);
        return true;
      } else {
        // node.findOne(".right").fill("#E9DAA8");
        return false;
      }
      // do not need to call layer.draw() here
      // because it will be called by dragmove action
    });

    let boundariesOverstepped = currentStage.children[1].children[1].children.some((border, i) => {
      // do not check intersection with itself or with strange lines!
      if ( i < 1 ) {
        return false;
      }

      // получить текущие координаты и размеры:
      let borderR = {
        x: border.attrs.x,
        y: border.attrs.y,
        width: border.attrs.width,
        height: border.attrs.height
      };

      console.log('borders:', borderR, nodeCurr);

      if (haveIntersection(borderR, nodeCurr)) {
        return true;
      } else {
        return false;
      }


    });

    let currentTargetColor = intersected || boundariesOverstepped ? "red" : "#E9DAA8";
    currentObject.findOne(".right").fill(currentTargetColor);
  };

  // обработчик движения:
  handleMovingObject = e => {
    // сейчас за пересечение берутся координаты float движимого объекта
    // однако, можно воспользоваться и координатами тени (если требуется):
    // e.currentTarget.children[0].children[162] // где 162 - индекс элемента "тень"
    
    // this.showIntersection(e.currentTarget, e.target);
  };

  // связь с redux store: -------------------------------------------------
  // для передачи состояния сцены в SidePanel:
  stageStateToRedux = () => {
    const { actions } = this.props;
    const newState = {
      shift: this.state.stageShift,
      scale: this.state.stageScale
    };

    actions.changeBoardState(newState);
  };

  // changing position and id of our Object:
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

  // тень текущего объекта: ------------------------------------------------
  activateShadow = (posX, posY, size) => {
    const blockSnapSize = this.state.blockSnapSize;
    this.setState({
      selectedObjectPos: [
        Math.round(posX / blockSnapSize) * blockSnapSize,
        Math.round(posY / blockSnapSize) * blockSnapSize
      ],
      selectedObjectSizes: size,
      shadowOpacity: 1
    });
  };

  stopShadow = objectPos => {
    this.objectDataToRedux();

    this.setState({
      shadowOpacity: 0
    });
  };

  // выбор объекта:
  setCurrentObjectId = id => {
    this.setState({
      selectedObjectId: id
    });
  };

  // контекстное меню текущего объекта: -----------------------------------------------
  showContextMenu = (x, y, shiftToWindow) => {
    let coords = [
      Math.floor(x * this.state.stageScale + this.state.stageShift[0]) + shiftToWindow.x, //x
      Math.floor(y * this.state.stageScale + this.state.stageShift[1]) + shiftToWindow.y - 50 //y
    ];

    this.setState({
      selectedObjectPos: coords,
      contextMenuShow: true
    });
  };

  hideContextMenu = () => {
    this.setState({
      contextMenuShow: false
    });
  };

  // автоподгон карты под границы stage:
  autoAdjustStage = (e) => {
    //границы карты:
    let mapWidth = 600;
    let mapHeight = 600;
    // padding:
    mapWidth += 40;
    mapHeight += 40;

    // границы окна:
    const { width, height } = this.props;

    // масштабирование:
    let scaleX = width / mapWidth;
    let scaleY = height / mapHeight;

    // масштабирование stage:
    //const scaleBy = scaleX > scaleY ? scaleX : scaleY;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = scaleX > scaleY ? scaleX : scaleY;

    stage.scale({ x: newScale, y: newScale });

    this.setState({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });

    //---обработка сдвига:
    stage.attrs.x = 0;
    stage.attrs.y = 0;

    this.setState({
        stageShift: [0, 0]
    });

    this.stageStateToRedux();
    //---------------------------------

  };

  render() {
    const { width, height, objects } = this.props;
    // settings for map (KonvaGrid):
    const { mapWidth, mapHeight, blockSnapSize } = this.state;

    const loadObject = objects.map((elem, i) => {
      return (
        <TableObject
          key={i}
          id={elem.id}
          x={elem.coordinates.x}
          y={elem.coordinates.y}
          width={elem.width}
          height={elem.height}
          globalWidth={width - 20}
          globalHeight={height - 20}
          blockSnapSize={blockSnapSize}
          showShadow={this.activateShadow}
          stopShadow={this.stopShadow}
          showContextMenu={this.showContextMenu}
          hideContextMenu={this.hideContextMenu}
          shareId={this.setCurrentObjectId}
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
          width={width}
          height={height}
          draggable={true}
          onWheel={this.handleWheel}
          scaleX={this.state.stageScale}
          scaleY={this.state.stageScale}
          onDragStart={this.hideContextMenu}
          onDragEnd={this.handleStopMoving}
          onDragMove={this.handleMovingObject}
          onDblClick={(e) => {
            this.autoAdjustStage(e);
          }}
        >
          <KonvaGridLayer
            width={mapWidth}
            height={mapHeight}
            blockSnapSize={blockSnapSize}
            boundaries={this.state.mapBoundaries}
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
              boundaries={this.state.mapBoundaries}
              borderlands={this.state.mapCovering}
            />
            {loadObject}
          </Layer>
        </Stage>
        {/*Context menu for the current object is here:*/}
        {this.state.contextMenuShow && (
          <PopoverContainer
            x={this.state.selectedObjectPos[0]}
            y={this.state.selectedObjectPos[1]}
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
  boardState: state.boardState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ changeBoardState, moveObject }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedBoard);
