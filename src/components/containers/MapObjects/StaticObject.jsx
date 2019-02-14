import React from 'react';
import { Rect, Text, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';
import objectCategories from '../../../res/objectCategories.json';
import getIconSettings from './iconSettingsForObjects';

export default class StaticObject extends React.Component {

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  // 1. Показать tooltip-информацию:
  showTooltipObjectInfo = (e) => {
    const { object } = this.props;

    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];
    
    tooltip.position({
      x : e.currentTarget.x(),
      y : e.currentTarget.y()
    });

    // добавить текст:
    let text = objectCategories.find((cat) => cat.id === object.category).title;
    if ( object.title !== undefined ) {
      text += (" : " + object.title);
    }
    tooltip.getText().setText(text);
    tooltip.show();
    tooltipLayer.draw();
  }

  //2. Скрыть tooltip-информацию:
  hideTooltipObjectInfo = (e) => {
    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];

    tooltip.hide();
    tooltipLayer.draw();
  }

  // ОБРАБОТКА СОБЫТИЙ:
  //---------------------------------------------------------
  onObjectClick = (e) => {
    // всегда сообщаем id объекта:
    const { 
      shareObjectData,
      object
    } = this.props;

    shareObjectData(object.id, object.userId);

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

    // draw a picture:
    let { shiftX, shiftY, scale } = getIconSettings(object.category);

    // отредактируем размер иконки по размеру объекта:
    let minSizeObjectValue = object.width < object.height ? object.width : object.height;
    let minSizeValue = 15;
    let scaleIncrease = (minSizeObjectValue/2) / minSizeValue;

    shiftX *= scaleIncrease;
    shiftY *= scaleIncrease;
    scale *= scaleIncrease;
    

    const drawIcon = iconPaths[object.category].path.map( (path, i) => {
      return (
        <Path
          key={i}
          x={object.width/2-shiftX}
          y={object.height/2-shiftY}
          data={path}
          fill='black'
          scale={{
            x: scale, //* scaleIncrease,
            y: scale //* scaleIncrease
          }}

        />
      );

    });
    
    
    return (
      <Group
        x={object.coordinates.x}
        y={object.coordinates.y}
        draggable={false}
        
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
          fill={setColor(object.id, object.correctLocation, object.color)}
          stroke={'black'}
          strokeWidth={0.5}
          // shadowColor={'black'}
          // shadowBlur={2}
          // shadowOffset={{x : 1, y : 1}}
          // shadowOpacity={0.4}  
            
        />
        {drawIcon}
      </Group> 
    );
  }
}

