import React from 'react';
import { Rect, Text, Group, Path } from 'react-konva';

import iconPaths from '../../../res/iconPaths';

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
    let text = object.category;
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
        case "column":
            scale = 0.015;
            paddingLeft = 3.5;
            paddingTop = 3.5;
            break;
        case "meeting_room":
            scale = 0.02;
            paddingLeft = 5;
            paddingTop = 5;
            break;
        case "public_place":
            scale = 0.15;
            paddingLeft = 5.5;
            paddingTop = 5.5;
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
        draggable={false}
        
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
        <Text
          text={`ID:${object.id}`}
          fontSize={6}
          align="center"
        />
        {drawIcon}
      </Group> 
    );
  }
}

