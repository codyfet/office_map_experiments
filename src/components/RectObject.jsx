import React from 'react';
import { Rect, Text, Group } from 'react-konva';
import { DEFAULT_COLOR, SELECTED_COLOR } from '../res/constantsObjectsColors';

export default class RectObject extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isDragging: false,
      color: DEFAULT_COLOR
    };
  }
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  //1. Держать координаты в границах глобальной области:
  checkBoundaries(x, y){
    const { globalWidth, globalHeight, width, height } = this.props;
    let checkedX = x < 10 ? 10 : (x > (globalWidth-(width-10)) ? (globalWidth-(width-10)) : x);
    let checkedY = y < 10 ? 10 : (y > (globalHeight-(height-10)) ? (globalHeight-(height-10)) : y);
    return {checkedX, checkedY};
  }

  //2. Выделить объект цветом:
  // замечу, что на объекты react-konva
  // передаваемое через jsx значение, даже если оно связано с state
  // не меняет элемент (на примере fill)
  selectObjectWithColor = (currentObject, stage) => {
  
    //1. рассмотрим все объекты и вернем им предыдущий цвет, если они были выделены:
    stage.children[1].children.forEach((node, i) => {
      // текущий объект не проверяем: 
      // 0 и 1 объекты - это тень и границы - их не трогаем!
      if ( node === currentObject || i < 2 ) {
        return false;
      }

      let rect = node.children[0];
      let currentFill = rect.attrs.fill;
      let prevFill = rect.attrs.prevFill;
      console.log('objectclick fill', i, node.children[0], currentFill, prevFill);
        
      if ( currentFill === SELECTED_COLOR ) {
        rect.fill(prevFill);
      }

    });

    //2. перекрасим текущий объект:
    // сохраняем текущий цвет:
    currentObject.children[0].attrs.prevFill = currentObject.children[0].attrs.fill;
    // закрашиваем в новый:
    currentObject.children[0].fill(SELECTED_COLOR);
  }

  //3. Снять выделение объекта:
  unselectObjectWithColor = (currentObject) => {
    // в этом случае уже не будет разных вариантов:
    // объект был выделен и не нужно проверять другие объекты,
    // ведь выделенным м.б. только 1 объект:
    let rect = currentObject.children[0];
    rect.fill(rect.attrs.prevFill);
    
  }

  //4. Показать tooltip-информацию о пользователе объекта:
  showTooltipObjectInfo = (e) => {
    const { userInfo } = this.props;

    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];

    var mousePos = e.target.getStage().getPointerPosition();
    console.log('pointerPosition', mousePos);
    tooltip.position({
      x : e.currentTarget.x(),
      y : e.currentTarget.y()
    });

    // добавить userId:
    tooltip.getText().setText(userInfo);
    tooltip.show();
    tooltipLayer.draw();
  }

  //5. Скрыть tooltip-информацию о пользователе объекта:
  hideTooltipObjectInfo = (e) => {
    let tooltipLayer = e.target.getStage().children[2];
    let tooltip = tooltipLayer.children[0];

    tooltip.hide();
    tooltipLayer.draw();
  }

  // ОБРАБОТКА СОБЫТИЙ:
  //---------------------------------------------------------
  onObjectDragStart = (e) => {
    const { hideContextMenu } = this.props;
    
    e.currentTarget.moveToTop();
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

    // ВЫДЕЛЕНИЕ ОБЪЕКТА ЦВЕТОМ:
    // console.log('objectclick object', e.currentTarget);
    // let stage = e.target.getStage();
    // let currentObject = e.currentTarget;

    // // обработка нажатий кнопок:
    // if (e.evt.button === 0) { // если нажата левая: то снимем выделение:
    //   this.unselectObjectWithColor(currentObject);
    //   hideContextMenu();

    // } else if (e.evt.button === 2) { // если нажата правая, то выделяем цветом:
    //   console.log('button 2', e);
    //   // выделяем объект цветом, только если он еще не выделен:
    //   if (currentObject.children[0].attrs.fill !== SELECTED_COLOR) {
    //     this.selectObjectWithColor(currentObject, stage);
    //   } 
    // }
    
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
        name={""+id}

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
      </Group> 
    );
  }
}

