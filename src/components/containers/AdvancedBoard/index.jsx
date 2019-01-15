import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import TableObject from '../../TableObject';
import KonvaGridLayer from '../../presentational/KonvaGridLayer/index';
import Portal from '../../Portal';

// redux:
import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeBoardState, moveFurniture } from '../../../actions/index';

//popup:
import PopoverContainer from '../PopoverContainer/index';


class AdvancedBoard extends React.Component {

  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    stageShift: [0, 0],

    shadowRectPos: [10, 10],
    shadowRectSizes: [10, 10],
    shadowOpacity: 0,

    selectedObjectId: -1,

    contextPos: [10, 10],
    contextShow: false
  };

  // управление сценой konva: сдвиг и масштаб --------------------------------------
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

    this.handleStageChanges();
  };

  // отвечает за передачу состояния сцены в SidePanel:
  handleStageChanges(){
    const { actions } = this.props; 
    const newState = {
      shift: this.state.stageShift,
      scale: this.state.stageScale
    };

    actions.changeBoardState(newState);
    console.log('created', newState);
    
  };

  // тень текущего объекта: ------------------------------------------------
  activateShadow = (posX, posY, size) => {
    const { blockSnapSize } = this.props;
    this.setState({
        shadowRectPos: [Math.round(posX / blockSnapSize) * blockSnapSize,
                        Math.round(posY / blockSnapSize) * blockSnapSize],
        shadowRectSizes: size,
        shadowOpacity: 1 
    });
    
  };

  stopShadow = () => {
    // adding с
    const { actions } = this.props;
    let newObjectData = {
      id: this.state.selectedObjectId,
      pos: { 
             x: this.state.shadowRectPos[0],
             y: this.state.shadowRectPos[1]
      }
    };
    console.log('stopShadow', newObjectData);
    actions.moveFurniture(newObjectData);

    this.setState({
        shadowOpacity: 0 
    }); 
  }
  
  // выбор объекта: 
  setCurrentObjectId = (id) => {
    this.setState({
      selectedObjectId: id
    });
  }

  // контекстное меню текущего объекта: -----------------------------------------------
  showContextMenu = (x, y) => {
    // if click on the same object and context menu has already showing:
    if ( this.state.contextPos[0] == x && this.state.contextPos[1] == y ) {
      this.setState({
        contextShow: !this.state.contextShow
      });  
    } else {
      this.setState({
        contextPos: [x, y],
        contextShow: true
      });
    }
  }

  hideContextMenu = () => {
    this.setState({
      contextShow: false
    });
  }

  render() {
    const { width, height, blockSnapSize, furnitures } = this.props; 

    // setting KonvaGrid resolution:
    let stageWidth = 800;
    let stageHeight = 800;

    const loadFurniture = furnitures.map((elem, i) => {
        return (
          <TableObject
            key={i}
            id={elem.id}
            x={elem.coordinates.x}
            y={elem.coordinates.y}  
            width={elem.width}
            height={elem.height}
            globalWidth={width-20}
            globalHeight={height-20}
            blockSnapSize={blockSnapSize}
            
            showShadow={this.activateShadow}
            stopShadow={this.stopShadow}
            
            showContextMenu={this.showContextMenu}
            hideContextMenu={this.hideContextMenu}
            
            shareId={this.setCurrentObjectId}

          />
        );
    });

    console.log('shift', this.state.stageShift[0], this.state.stageShift[1]);

    return (
        <div style={{
            border: '1px solid black'
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
                onDragEnd={
                  (e) => {
                    console.log('coords for the moved stage:', e.currentTarget.x(), e.currentTarget.y());
                    console.log('coords for the moved object:', e.target.x(), e.target.y());
                    this.setState({
                      stageShift: [e.currentTarget.x(), e.currentTarget.y()]
                    });
                    this.handleStageChanges();
                  }
                }
                >

                <KonvaGridLayer
                   width={stageWidth} 
                   height={stageHeight} 
                   blockSnapSize={blockSnapSize}
                   
                >
                    {/*Shadow is here:*/}
                    <Rect 
                      x={this.state.shadowRectPos[0]}
                      y={this.state.shadowRectPos[1]}
                      width={this.state.shadowRectSizes[0]}
                      height={this.state.shadowRectSizes[1]}
                      fill={'orange'}
                      opacity={this.state.shadowOpacity}
                      stroke={'#AE4C01'}
                      strokeWidth={2}
                    />
                    {loadFurniture}
                </KonvaGridLayer>
            </Stage>
            {/*Context menu for the current object is here:*/}
            {this.state.contextShow &&
              <PopoverContainer 
                x={Math.floor(this.state.contextPos[0] * this.state.stageScale + this.state.stageShift[0])}
                y={Math.floor(this.state.contextPos[1] * this.state.stageScale + this.state.stageShift[1]) + 5}
                objectId={this.state.selectedObjectId}
                readyHandler={this.hideContextMenu}
                // turnHandler={}
                // editHandler={}
                // deleteHandler={}
              />
            }
            
        </div>
        
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  furnitures: state.furnitures,
  boardState: state.boardState
});
  
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ changeBoardState, moveFurniture }, dispatch)
});
  
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedBoard);