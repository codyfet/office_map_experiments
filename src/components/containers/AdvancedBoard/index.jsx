import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import TableObject from '../../TableObject';
import KonvaGridLayer from '../../presentational/KonvaGridLayer/index';
import { Popover } from 'react-bootstrap';
import Portal from '../../Portal';

// redux:
import { connect } from 'react-redux';
import ContextMenuView from '../../presentational/ContextMenuView/index';


class AdvancedBoard extends React.Component {

  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    shadowRectPos: [10, 10],
    shadowRectSizes: [10, 10],
    shadowOpacity: 0,
    blockSnapSize: 10,
    context: [10, 10],
    contextShow: false
  };

  // update the block size every time the component gets the props:
  componentWillReceiveProps(newProps) {
    this.setState({
      blockSnapSize: newProps.blockSnapSize
    });
  }

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
  };

  activateShadow = (posX, posY, size) => {
    let blockSize = this.state.blockSnapSize;
    this.setState({
        shadowRectPos: [Math.round(posX / blockSize) * blockSize,
                        Math.round(posY / blockSize) * blockSize],
        shadowRectSizes: size,
        shadowOpacity: 1 
    });
    
  };

  stopShadow = () => {
    this.setState({
        shadowOpacity: 0 
    }); 
  }

  showContextMenu = (x, y) => {
    this.setState({
      context: [x, y],
      contextShow: true
    });
  }

  hideContextMenu = () => {
    this.setState({
      contextShow: false
    });
  }

  render() {
    const { width, height, blockSnapSize, furnitures } = this.props; 

    const loadFurniture = furnitures.map((elem, i) => {
        return (
          <TableObject
            key={i}
            id={i}
            x={elem.coordinates.x}
            y={elem.coordinates.y}  
            width={20}
            height={30}
            globalWidth={width-20}
            globalHeight={height-20}
            blockSnapSize={blockSnapSize}
            showShadow={this.activateShadow}
            stopShadow={this.stopShadow}
            showContextMenu={this.showContextMenu}
            hideContextMenu={this.hideContextMenu}
          />
        );
    });

    return (
        <div style={{
            width: '810px', 
            height: '810px'
        }}
        >
            <Stage 
                width={width} 
                height={height}
                draggable={true}
                onWheel={this.handleWheel}
                scaleX={this.state.stageScale}
                scaleY={this.state.stageScale}
                >

                <KonvaGridLayer
                   width={width} 
                   height={height} 
                   blockSnapSize={blockSnapSize}  
                >
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
                    {/*Context menu here:*/}
                </KonvaGridLayer>
            </Stage>
            {this.state.contextShow && 
              <Popover 
                id="popover-basic"
                placement="right"
                positionLeft={this.state.context[0]}
                positionTop={this.state.context[1] - 30}
                title="Popover right"
                animation={true}
              >
                And here's some <strong>amazing</strong> content. It's very engaging. right?
              </Popover>
            }
        </div>
        
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  furnitures: state.furnitures
});
  
const mapDispatchToProps = (dispatch) => ({

});
  
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedBoard);