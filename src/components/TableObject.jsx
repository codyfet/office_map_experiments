import React from 'react';
import { Rect, Text, Group } from 'react-konva';

export default class TableObject extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isDragging: false,
      width: this.props.width,
      height: this.props.height,
      color: '#fff'
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


  render() {
    const {x, 
           y,
           id,
           shareId, 
           blockSnapSize, 
           showShadow, 
           stopShadow, 
           showContextMenu,
           hideContextMenu } = this.props;
    
    

    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        
        onDragStart={(e) => {
          e.currentTarget.moveToTop();
          hideContextMenu();
        }}
        
        onDragEnd={(e) => {
          let { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
          console.log('onDragEnd', checkedX, checkedY);
          e.currentTarget.position({
            x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
            y: Math.round(checkedY / blockSnapSize) * blockSnapSize
          });
          showShadow(e.currentTarget.x(), e.currentTarget.y(), [this.state.width, this.state.height]);
          shareId(id);  
          stopShadow();
        }}
            
        onDragMove={
          (e) => showShadow(e.currentTarget.x(), e.currentTarget.y(), [this.state.width, this.state.height])
        }

        onClick={(e) => {
          showContextMenu(e.currentTarget.x(), e.currentTarget.y());
          shareId(id); 
        }}
        
      >
        <Rect
          width={this.state.width}
          height={this.state.height}
          fill={this.state.color}
          stroke={'#ddd'}
          strokeWidth={1}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{x : 1, y : 1}}
          shadowOpacity={0.4}    
            
        />
        <Text
          text={`ID:${id}`}
          fontSize={10}
        />
      </Group> 
    );
  }
}

