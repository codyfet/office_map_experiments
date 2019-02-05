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

  //2. Показать tooltip-информацию:
  showTooltipObjectInfo = (e) => {
    const { object, user } = this.props;

    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];
    
    tooltip.position({
      x : e.currentTarget.x(),
      y : e.currentTarget.y()
    });

    // добавить текст:
    let text = object.category;
    if (object.category === "table") {
        text += " : ";
        text += (user !== undefined) ? user.title : 'no user';
    }

    tooltip.getText().setText(text);
    tooltip.show();
    tooltipLayer.draw();
  }

  //3. Скрыть tooltip-информацию:
  hideTooltipObjectInfo = (e) => {
    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];

    tooltip.hide();
    tooltipLayer.draw();
  }

  // ОБРАБОТКА СОБЫТИЙ:
  //---------------------------------------------------------
  onObjectDragStart = (e) => {
    const { hideContextMenu, object, shareObjectData } = this.props;
    
    // e.currentTarget.moveToTop();
    shareObjectData(object.id, object.userId);
    hideContextMenu();
  }
  
  onObjectDragEnd = (e) => {
    const { 
      showShadow, 
      stopShadow, 
      shareObjectData,
      blockSnapSize, 
      object
    } = this.props;
    
    let { checkedX, checkedY } = this.checkBoundaries(e.currentTarget.x(), e.currentTarget.y());
    e.currentTarget.position({
      x: Math.round(checkedX / blockSnapSize) * blockSnapSize,
      y: Math.round(checkedY / blockSnapSize) * blockSnapSize
    });
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]); 
    shareObjectData(object.id, object.userId);

    stopShadow();
  }
      
  onObjectDragMove = (e) => {
    const { 
      showShadow, 
      object 
    } = this.props;
    
    showShadow(e.currentTarget.x(), e.currentTarget.y(), [object.width, object.height]);
    this.showTooltipObjectInfo(e);
  }
  

  onObjectClick = (e) => {
    // всегда сообщаем id объекта:
    const { 
      shareObjectData,
      object
    } = this.props;

    shareObjectData(object.id, object.userId);
    
    // если нужно - выведем объект на передний план:
    e.currentTarget.moveToTop();
    
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
      object,
      setColor
    } = this.props;

    console.log('movable object', object);

    // draw a picture:
    // рассчитаем scale и paddingTop, paddingLeft: потом исправить!!!
    let scale = 1;
    let paddingTop = 0;
    let paddingLeft = 0;
    switch (object.category) {
        case "table":
            scale = 0.025;
            paddingLeft = 6;
            paddingTop = 4;
            break;
        case "cupboard":
            scale = 0.02;
            paddingLeft = 5;
            paddingTop = 5;
            break;
        case "printer":
            scale = 0.03;
            paddingLeft = 5.5;
            paddingTop = 5.5;
            break;
        case "scaner":
            scale = 0.02;
            paddingLeft = 5;
            paddingTop = 5;
            break;
        case "shredder":
            scale = 0.02;
            paddingLeft = 5;
            paddingTop = 5;
            break;
        default:
            break;
    };

    const drawIcon = iconPaths[object.category].path.map( (path, i) => {
      return (
        <Path
          key={i}
          x={object.width/2-paddingLeft}
          y={object.height/2-paddingTop}
          data={path}
          fill='black'
          scale={{
            x: scale,
            y: scale
          }}

        />
      );

    });
    
    
    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
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
          width={object.width}
          height={object.height}
          fill={setColor(object.id, object.correctLocation)}
          // stroke={'black'}
          // strokeWidth={0.5}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{x : 1, y : 1}}
          shadowOpacity={0.4}  
            
        />
        {/* <Text
          text={`ID:${object.id}`}
          fontSize={6}
          align="center"
        /> */}
        {drawIcon}
      </Group> 
    );
  }
}

