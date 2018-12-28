import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import ColoredRect from './KonvaElement';
import TableObject from './TableObject';

class AdvancedBoard extends React.Component {

  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    shadowRect: [0, 0]
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

  render() {
    const blockSnapSize = 10; 
    let width = 800;
    let height = 800;

    let padding = blockSnapSize;
    let blocksCount = width / blockSnapSize ^ 0;

    const makeVerticalGrid = [...Array(blocksCount)].map((elem, i) => {
        return (
            <Line
                points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]} 
                stroke={'#ddd'}
                strokeWidth={1}
            >    
            </Line>
        ); 
    });

    const makeHorizontalGrid = [...Array(blocksCount)].map((elem, j) => {
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
                    />
        });
    });

    return (
        <div style={{
            width: '800px', 
            height: '800px',
            border: '1px solid blue'
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