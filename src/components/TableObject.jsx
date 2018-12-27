import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

export default class TableObject extends React.Component {
  state = {
    isDragging: false
  };

  handleClick = (e) => {
    console.log(e.target.x(), e.target.y());
  };

  render() {
    const {x, y, width, height, blockSnapSize} = this.props;
    
    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={'#fff'}
        stroke={'#ddd'}
        strokeWidth={1}
        shadowColor={'black'}
        shadowBlur={2}
        shadowOffset={{x : 1, y : 1}}
        shadowOpacity={0.4}    
        draggable={true}
    
        onDragStart={(e) => {
          e.target.moveToTop();
        }}
        onDragEnd={(e) => {
          e.currentTarget.position({
            x: Math.round(e.target.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(e.target.y() / blockSnapSize) * blockSnapSize
          });
          this.rect.getLayer().batchDraw();
        }}
        onDragMove={() => {
          this.setState({
            isDragging: false
          });
        }}
      />
    );
  }
}

