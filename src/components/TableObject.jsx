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

  checkBoundaries = (x, y) => {
    const {width, height, globalWidth, globalHeight} = this.props;
    console.log(globalWidth, globalHeight);
    let checkedX = x < 10 ? 10 : (x > (globalWidth-(width-10)) ? (globalWidth-(width-10)) : x);
    let checkedY = y < 10 ? 10 : (y > (globalHeight-(height-10)) ? (globalHeight-(height-10)) : y);
    return {checkedX, checkedY};
  }

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
          // 
        }}
        onDragMove={(e) => {

          let { checkedX, checkedY } = this.checkBoundaries(e.target.x(), e.target.y());
          // console.log(checkedX, checkedY);
          e.target.position({
            x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
            y: Math.round(checkedY / blockSnapSize) * blockSnapSize
          });
          // this.rect.getLayer().batchDraw();
        }}
        
      />
    );
  }
}

