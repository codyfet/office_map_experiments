import * as React from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';
import ColoredRect from './KonvaElement';

class Board extends React.Component {
//   componentDidMount() {
//     this.updateCanvas();
//   }
//   updateCanvas() {
//     const ctx = this.refs.canvas.getContext('2d');
//     ctx.fillRect(0,0, 100, 100);
//   }
  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0
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

  const spawnField = [...Array(20)].map((elem, i_y) => {
    return [...Array(20)].map((elem, i_x) => {
        let uniqPos = [20 + i_x * 15, 20 + i_y * 15];
        return <ColoredRect 
              key={Number(uniqPos[0] + '' + uniqPos[1])}
              x={uniqPos[0]} 
              y={uniqPos[1]} 
            />;
    });
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
        <Group
          x={10}
          y={10}
          dragBoundFunc={
            (pos) => {
              var newY = pos.y < 50 ? 50 : pos.y;
              return {
                x: pos.x,
                y: newY
              };
            } 
          }
        >
          {spawnField}
        </Group>
        
      </Layer>
    </Stage>
    </div>
    
  );
  }
}


export default Board;