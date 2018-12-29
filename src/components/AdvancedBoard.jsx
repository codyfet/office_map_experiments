import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import ColoredRect from './KonvaElement';
import TableObject from './TableObject';

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
    const blockSnapSize = this.state.blockSnapSize; 
    let width = 800;
    let height = 800;

    let padding = blockSnapSize;
    let blocksCount = width / blockSnapSize ^ 0;

    const makeVerticalGrid = [...Array(blocksCount+1)].map((elem, i) => {
        return (
            <Line
                points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]} 
                stroke={'#ddd'}
                strokeWidth={1}
            >    
            </Line>
        ); 
    });

    const makeHorizontalGrid = [...Array(blocksCount+1)].map((elem, j) => {
        return (
            <Line
                points={[0, Math.round(j * padding), width, Math.round(j * padding)]} 
                stroke={'#ddd'}
                strokeWidth={0.5}
            >    
            </Line>
        ); 
    });

    const spawnField = [...Array(10)].map((elem, i_y) => {
        return [...Array(10)].map((elem, i_x) => {
            let uniqPos = [10 + i_x * 30, 10 + i_y * 40];
            return <TableObject
                        key={Number(uniqPos[0] + '' + uniqPos[1])}
                        x={uniqPos[0]} 
                        y={uniqPos[1]} 
                        width={20}
                        height={30}
                        globalWidth={width-20}
                        globalHeight={height-20}
                        blockSnapSize={blockSnapSize}
                        showShadow={this.activateShadow}
                        stopShadow={this.stopShadow}
                    />
        });
    });

    return (
        <div style={{
            width: '810px', 
            height: '810px',
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
                >
                <Layer>
                    {makeVerticalGrid}
                    {makeHorizontalGrid}
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
                    {spawnField}
                </Layer>
            </Stage>
        </div>
        
    );
  }
}

/*
x={x}
y={y}
width={width}
height={height}
fill={'#FF7B17'}
opacity={0.6}
stroke={'#CF6412'}
strokeWidth={3}
dash={[20, 2]}
*/

export default AdvancedBoard;