import * as React from 'react';
import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva';
import ColoredRect from './KonvaElement';
import TableObject from './TableObject';

class AdvancedBoard extends React.Component {

  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0
  };

  render() {
    const blockSnapSize = 10; 
    let width = 500;
    let height = 500;

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

    return (
        <div style={{
            width: '500px', 
            height: '500px',
            border: '1px solid blue'
        }}
        >
            <Stage 
                width={500} 
                height={500}
                draggable={true}
                onWheel={this.handleWheel}
                scaleX={this.state.stageScale}
                scaleY={this.state.stageScale}
                >
                <Layer>
                    {makeVerticalGrid}
                    {makeHorizontalGrid}
                    <TableObject
                        x={10}
                        y={10}
                        width={20}
                        height={10}
                        blockSnapSize={blockSnapSize} 
                    />
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