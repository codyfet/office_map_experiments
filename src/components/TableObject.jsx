import React from 'react';
import { Rect, Text, Group } from 'react-konva';

export default class TableObject extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isDragging: false,
      color: '#E9DAA8'
    };
  }

  checkBoundaries(x, y){
    const { globalWidth, globalHeight, width, height } = this.props;
    let checkedX = x < 10 ? 10 : (x > (globalWidth-(width-10)) ? (globalWidth-(width-10)) : x);
    let checkedY = y < 10 ? 10 : (y > (globalHeight-(height-10)) ? (globalHeight-(height-10)) : y);
    return {checkedX, checkedY};
  }


  render() {
    const {x, 
           y,
           width,
           height,
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
          showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height]);
          shareId(id);  
          stopShadow();
        }}
            
        onDragMove={
          (e) => showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height])
        }

        onClick={(e) => {
          showContextMenu(e.currentTarget.x(), e.currentTarget.y());
          shareId(id); 
        }}
        
      >
        <Rect
          width={width}
          height={height}
          fill={this.state.color}
          // stroke={'black'}
          // strokeWidth={1}
          // shadowColor={'black'}
          // shadowBlur={2}
          // shadowOffset={{x : 1, y : 1}}
          // shadowOpacity={0.4}  
          name='area'  
            
        />
        <Text
          text={`ID:\n${id}`}
          fontSize={10}
          align="center"
        />
        {/* <button>
          <Text text={'Hi'}/>
        </button> */}
      </Group> 
    );
  }
}

