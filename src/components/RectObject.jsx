import React from 'react';
import { Rect, Text, Group } from 'react-konva';

export default class RectObject extends React.Component {
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

  // ОБРАБОТКА СОБЫТИЙ:
  onObjectDragStart = (e) => {
    const { hideContextMenu } = this.props;
    
    e.currentTarget.moveToTop();
    hideContextMenu();
  }
  
  onObjectDragEnd = (e) => {
    const { 
      showShadow, 
      stopShadow, 
      shareId, 
      blockSnapSize, 
      width, 
      height,
      id 
    } = this.props;
    
    let { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
    e.currentTarget.position({
      x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
      y: Math.round(checkedY / blockSnapSize) * blockSnapSize
    });
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height]);
    shareId(id);  
    stopShadow();
  }
      
  onObjectDragMove = (e) => {
    const { 
      showShadow, 
      width, 
      height 
    } = this.props;
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height]);
  }
  

  onObjectClick = (e) => {
    const { showContextMenu, shareId, id } = this.props;
    // // надйдём сдвиг Stage относительно окна:
    // const shiftToWindow = {
    //                 x: e.evt.clientX - e.evt.layerX,
    //                 y: e.evt.clientY - e.evt.layerY
    // };
    // showContextMenu(e.currentTarget.x(), e.currentTarget.y(), shiftToWindow);
    console.log('objectclick', e);
    shareId(id); 
  }

  onObjectMouseMove = (e) => {
    const { userInfo } = this.props;
    // console.log(e);

    let tooltipLayer = e.target.getStage().children[2];
    // console.log(tooltipLayer);
    let tooltip = tooltipLayer.children[0];
    // console.log(tooltip);

    var mousePos = e.target.getStage().getPointerPosition();
    tooltip.position({
      x : mousePos.x,
      y : mousePos.y
    });

    // добавить userId:
    tooltip.text = userInfo;
    tooltip.visible = true;
    tooltip.show();
    tooltipLayer.draw();

  }

  // onObjectMouseOut = (e) => {
  //   const { userInfo } = this.props;
  //   console.log(e.ext);
  //   let tooltipLayer = e.target.getStage().children[2];
  //   console.log(tooltipLayer);
  //   tooltip.position({
  //     x : 0,
  //     y : 0
  //   });
  //   // добавить userId:
  //   tooltip.text(userInfo);
  //   tooltip.show();
  //   tooltipLayer.batchDraw();

  // }
  //---------------------------------------------------------------------------


  render() {
    const {
      x, 
      y,
      width,
      height,
      id
    } = this.props;
    
    
    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        
        onDragStart={this.onObjectDragStart}
        onDragEnd={this.onObjectDragEnd}
        onDragMove={this.onObjectDragMove}
        onClick={this.onObjectClick}
        onMouseMove={this.onObjectMouseMove}
        name="object"

      >
        <Rect
          width={width}
          height={height}
          fill={this.state.color}
          stroke={'black'}
          strokeWidth={1}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{x : 1, y : 1}}
          shadowOpacity={0.4}  
          name='right' // имя объекта  
            
        />
        <Text
          text={`ID:${id}`}
          fontSize={6}
          align="center"
        />
      </Group> 
    );
  }
}

