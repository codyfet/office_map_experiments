import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

export default class ColoredRect extends React.Component {
  state = {
    isDragging: false
  };

  handleClick = (e) => {
    console.log(e.target.x(), e.target.y());
  };

  render() {
    const {x, y} = this.props; 
    
    return (
      <Rect
        x={x}
        y={y}
        width={10}
        height={10}
        shadowBlur={2}
        draggable
        fill={this.state.isDragging ? 'green' : 'black'}
        onDragStart={() => {
          this.setState({
            isDragging: true
          });
        }}
        onDragEnd={() => {
          this.setState({
            isDragging: false
          });
        }}
        onMouseUp={this.handleClick}
      />
    );
  }
}

