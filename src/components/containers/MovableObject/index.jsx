import React from 'react';
import { Rect, Text, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';

export default class MovableObject extends React.Component {

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  //1. Держать координаты в границах глобальной области:
  checkBoundaries(x, y){
    const { globalWidth, globalHeight, width, height } = this.props;
    let checkedX = x < 10 ? 10 : (x > (globalWidth-(width-10)) ? (globalWidth-(width-10)) : x);
    let checkedY = y < 10 ? 10 : (y > (globalHeight-(height-10)) ? (globalHeight-(height-10)) : y);
    return {checkedX, checkedY};
  }

  //2. Показать tooltip-информацию о пользователе объекта:
  showTooltipObjectInfo = (e) => {
    const { userInfo } = this.props;

    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];
    
    tooltip.position({
      x : e.currentTarget.x(),
      y : e.currentTarget.y()
    });

    // добавить userId:
    tooltip.getText().setText(userInfo);
    tooltip.show();
    tooltipLayer.draw();
  }

  //3. Скрыть tooltip-информацию о пользователе объекта:
  hideTooltipObjectInfo = (e) => {
    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];

    tooltip.hide();
    tooltipLayer.draw();
  }

  // ОБРАБОТКА СОБЫТИЙ:
  //---------------------------------------------------------
  onObjectDragStart = (e) => {
    const { hideContextMenu, id, userId, shareObjectData } = this.props;
    
    e.currentTarget.moveToTop();
    shareObjectData(id, userId);
    hideContextMenu();
  }
  
  onObjectDragEnd = (e) => {
    const { 
      showShadow, 
      stopShadow, 
      shareObjectData,
      id,
      userId, 
      blockSnapSize, 
      width, 
      height
    } = this.props;
    
    let { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
    e.currentTarget.position({
      x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
      y: Math.round(checkedY / blockSnapSize) * blockSnapSize
    });
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height]); 
    shareObjectData(id, userId);

    stopShadow();
  }
      
  onObjectDragMove = (e) => {
    const { 
      showShadow, 
      width, 
      height 
    } = this.props;
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [width, height]);
    this.showTooltipObjectInfo(e);
  }
  

  onObjectClick = (e) => {
    // всегда сообщаем id объекта:
    const { 
      shareObjectData,
      id,
      userId,
      hideContextMenu 
    } = this.props;

    shareObjectData(id, userId);
    
  }

  onObjectContextMenu = (e) => {
    const { showContextMenu } = this.props;
    e.evt.preventDefault();
    showContextMenu(e.evt.clientX, e.evt.clientY);
  }

  onObjectMouseMove = (e) => {
    this.showTooltipObjectInfo(e);

  }

  onObjectMouseOut = (e) => {
    this.hideTooltipObjectInfo(e);
  
  }
  

  render() {
    const {
      x, 
      y,
      width,
      height,
      id,
      correctLocation,
      setColor
    } = this.props;

    // draw a picture:
    // const drawIcon = iconPaths.shredder.path.map( (elem) => {
    //   return (
    //     <Path
    //       x={width/2-5}
    //       y={height/2-5}
    //       data={elem}
    //       fill='black'
    //       scale={{
    //         x: 0.02,
    //         y: 0.02
    //       }}

    //     />
    //   );

    // });
    
    
    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        
        onDragStart={this.onObjectDragStart}
        onDragEnd={this.onObjectDragEnd}
        onDragMove={this.onObjectDragMove}
        onClick={this.onObjectClick}
        onContextMenu={this.onObjectContextMenu}
        onMouseEnter={this.onObjectMouseMove}
        onMouseLeave={this.onObjectMouseOut}
        name="object"

      >
        <Rect
          width={width}
          height={height}
          fill={setColor(id, correctLocation)}
          stroke={'black'}
          strokeWidth={1}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{x : 1, y : 1}}
          shadowOpacity={0.4}  
          name='right' // имя объекта  
          prevFill={setColor(id, correctLocation)}
            
        />
        <Text
          text={`ID:${id}`}
          fontSize={6}
          align="center"
        />
        {/* {drawIcon} */}
      </Group> 
    );
  }
}

