import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import TableObject from '../../TableObject';
import KonvaGridLayer from '../../presentational/KonvaGridLayer/index';

// redux:
import { connect } from 'react-redux';


class AdvancedBoard extends React.Component {

  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    shadowRectPos: [10, 10],
    shadowRectSizes: [10, 10],
    shadowOpacity: 0,
    blockSnapSize: 10
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
                </KonvaGridLayer>
            </Stage>
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