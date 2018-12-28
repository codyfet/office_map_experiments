import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

export default class TableObject extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isDragging: false,
      width: this.props.width,
      height: this.props.height
    };
  }

  rotateObject = (e) => {
    let newWidth = this.state.height;
    let newHeight = this.state.width;
    this.setState({
      width: newWidth,
      height: newHeight
    });
  };

  checkBoundaries(x, y){
    const {globalWidth, globalHeight} = this.props;
    let checkedX = x < 10 ? 10 : (x > (globalWidth-(this.state.width-10)) ? (globalWidth-(this.state.width-10)) : x);
    let checkedY = y < 10 ? 10 : (y > (globalHeight-(this.state.height-10)) ? (globalHeight-(this.state.height-10)) : y);
    return {checkedX, checkedY};
  }

  onDragMove = () => {
    this.props.sh
  }

  render() {
    const {x, y, blockSnapSize, showShadow, stopShadow} = this.props;
    
    return (
      <Rect
        x={x}
        y={y}
        width={this.state.width}
        height={this.state.height}
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
          let { checkedX, checkedY } = this.checkBoundaries(e.target.x(), e.target.y());
          e.target.position({
            x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
            y: Math.round(checkedY / blockSnapSize) * blockSnapSize
          }); 
          stopShadow();
        }}
        onDragMove={
          (e) => showShadow(e.target.x(), e.target.y(), [this.state.width, this.state.height])
        }
        onClick={this.rotateObject}
        
      />
    );
  }
}

