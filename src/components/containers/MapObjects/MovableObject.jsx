import React from 'react';
import { Rect, Text, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';

// загрузить lodash:
var _ = require('lodash');

export default class MovableObject extends React.Component {

  componentDidUpdate(prevProps){
    const { checkObjectLocation, object } = this.props;

    // проверим границы для измененного объекта:
    // будем проверять границы при каждом изменении размеров объекта:
    if ( prevProps.object.width !== object.width ) {
      console.log('check loaction for object: ', object);
      checkObjectLocation(object);
    }
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  //1. Держать координаты в границах глобальной области:
  checkBoundaries(x, y){
    const { mapWidth, mapHeight, object } = this.props;
    let checkedX = x <= 0 ? 0  
                   : ( x >= ( mapWidth - object.width ) 
                       ? ( mapWidth - object.width ) 
                       : x
                     );
    let checkedY = y <= 0 ? 0  
                   : ( y >= ( mapHeight - object.height ) 
                       ? ( mapHeight - object.height ) 
                       : y
                     );
    console.log('checked:', checkedX, checkedY);
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
    let text = objectCategories.find((cat) => cat.id === object.category).title;
    if (object.category === "table") {
        text += " : ";
        text += (user !== undefined) ? user.title : 'пустой';
    } else if ( object.title !== undefined ) {
      text += (" : " + object.title);
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
    
    // выведем объект на передний план:
    e.currentTarget.moveToTop();
    
    // обработка информации о пользователе:
    let userId = (object.userId === undefined) ? '' : object.userId;
    shareObjectData(object.id, userId);
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
    // обработка информации о пользователе:
    let userId = (object.userId === undefined) ? '' : object.userId;
    shareObjectData(object.id, userId);

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

    // обработка информации о пользователе:
    let userId = (object.userId === undefined) ? '' : object.userId;
    shareObjectData(object.id, userId);
    
    // выведем объект на передний план:
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

    const userId = object.userId;

    // draw a picture:
    const { shiftX, shiftY, scale } = getIconSettings(object.category);

    const drawIcon = iconPaths[object.category].path.map( (path, i) => {
      return (
        <Path
          key={i}
          x={object.width/2-shiftX}
          y={object.height/2-shiftY}
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
        nameID={object.id}

      >
        <Rect
          width={object.width}
          height={object.height}
          fill={setColor(object.id, 
                         object.correctLocation, 
                         object.color,
                         userId)}
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

