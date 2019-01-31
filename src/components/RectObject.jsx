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
    // console.log('objectclick object', e.currentTarget);
    // let stage = e.target.getStage();
    // let currentObject = e.currentTarget;
  
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
    // всегда сообщаем id объекта:
    const { shareId, id } = this.props;
    shareId(id);

    if (e.evt.button === 0) { // если нажата левая кнопка мыши:
      // ВЫДЕЛЕНИЕ ОБЪЕКТА ЦВЕТОМ:
      console.log('objectclick object', e.currentTarget);
      let stage = e.target.getStage();
      let currentObject = e.currentTarget;

      // если объект уже выделен, то снимем выделение:
      if (currentObject.children[0].attrs.fill === SELECTED_COLOR) {
        this.unselectObjectWithColor(currentObject);
      } else {
        this.selectObjectWithColor(currentObject, stage);
      }

    }
    
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
    
    console.log('redraw?');
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
          fill={DEFAULT_COLOR}
          stroke={'black'}
          strokeWidth={1}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{x : 1, y : 1}}
          shadowOpacity={0.4}  
          name='right' // имя объекта  
          prevFill={DEFAULT_COLOR}
            
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

