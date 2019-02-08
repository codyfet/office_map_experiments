import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import UsersList from '../UsersList/index';
import './styles.css';
import CreateTab from '../../containers/CreateTab/index';
import CurrentObjectTab from '../../containers/CurrentObjectTab/index';
import MapLevelItem from '../../containers/MapLevelItem/index';

// для генерирования уникальных id:
var genUniqId = require('uniqid');

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  createObject, 
  changeCurrentObject, 
  changeCurrentUser,
  changeMapLevel,
  changeObjectsLevel,
  changeBoardState
} from '../../../actions/index';

// статические данные карты:
import mapData from '../../../res/mapData.json';
import createMapObject from './objectsFactory';


class SidePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedObjectId: '',
      selectedUserId: ''
    };
  }

  getConvertedCoordsFrom(x, y) {
    const { shift, scale } = this.props.boardState;
    // console.log('SidePanel', scale, shift);
    
    return { 
      x: (x - shift[0])/scale, 
      y: (y - shift[1])/scale
    };
    
  }

  checkUserAssignedToTable(userId) {
    // если пользователя нет, то проверять ничего не надо:
    if ( userId === '' ) {
      return false
    }

    // иначе ищем пользователя по объектам всех уровней:
    const { objects } = this.props;
    for ( let lvl of objects.levels) {
      for ( let obj of lvl) {
        if ( obj.userId === userId ) {
          return true;
        }
      }

    }
    return false;
  }

  onSubmitClick = () => {
    const { actions } = this.props;
    const { selectedObjectId, selectedUserId } = this.state;
    
    
    // Проверки на ошибки:
    if ( selectedObjectId === '' ) {
      alert("ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Выберите объект!");
      return;
    } else if ( selectedObjectId === 'table' ) {
      if ( this.checkUserAssignedToTable(selectedUserId) ) {
        alert("ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!");
        return;
      } 
    }
      
    const newObject = createMapObject(selectedObjectId, 
                                      genUniqId(), 
                                      this.getConvertedCoordsFrom(750, 20),
                                      selectedUserId);
    
    console.log('newObject', newObject);
    actions.createObject(newObject);

  }

  

  selectObjectId = (id) => {
    this.setState({
      selectedObjectId: id
    });
    // console.log('selectedObjectId', id);
  }

  selectUserId = (id) => {
    this.setState({
      selectedUserId: id
    });
    // console.log('selectedUserId', id);
  }

  // FOR REDUX:
  // обнулить состояние:
  cleanCurrentObjectState = () => {
    const { actions } = this.props;
    actions.changeCurrentObject('');
    actions.changeCurrentUser('');
    
    // console.log('current state cleaned');
  }

  // изменить уровень (этаж здания)
  onSelectLevel = (levelNumber) => {
    this.cleanCurrentObjectState();

    const { actions } = this.props;
    actions.changeMapLevel(levelNumber);
    actions.changeObjectsLevel(levelNumber);
    console.log('changeLevel');
    // this.autoAdjustStage();
  
  }

  // УПРАВЛЕНИЕ СОБЫТИЯМИ НА KONVA STAGE: --------------------------------------
  // Авто-подстройка масштаба и сдвига под границы stage:
  autoAdjustStage = () => {
    // padding:
    const padding = 20;
    // получаем границы карты:
    const { mapWidth, mapHeight } = this.props.mapState;

    // получаем границы окна :
    const { width, height } = this.props;

    // настраиваем масштаб:
    let scaleX = width / (mapWidth + padding);
    let scaleY = height / (mapHeight + padding);
    const newScale = scaleX > scaleY ? scaleX : scaleY;

    // сразу в redux:
    const { actions } = this.props;
    const newState = { 
      shift: [0, 0], 
      scale: newScale            
    };

    actions.changeBoardState(newState);

  };

  render() {

    const { selectedObjectId, currentObject } = this.props;

    return (
      <div className="sidePanelContainer">
        {/* handle map level change: */}
        <MapLevelItem 
          currentLevel={this.props.mapState.mapLevel}
          onSelectLevel={this.onSelectLevel}/>
        {/* accordeon: */}
        <Accordion>
          <AccordionItem 
            title="Редактировать" 
            expanded={ currentObject.state !== 'none' } 
          >
            <CurrentObjectTab />
            
          </AccordionItem>
          <AccordionItem title="Создать">
            <CreateTab
              onObjectClick={this.selectObjectId}
              
              objectId={this.state.selectedObjectId}
              onUserClick={this.selectUserId} 
            />
            <button
              style={{width: '100%'}}
              onClick={this.onSubmitClick}
            >
              Создать
            </button>
          </AccordionItem>
          <AccordionItem title="Пользователи">
            <UsersList />
          </AccordionItem>
          <AccordionItem title="Карта">
            <button
              style={{width: '100%'}}
            >
              Сохранить карту
            </button>
          </AccordionItem>
        </Accordion>
      </div>
      
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  objects: state.objects,
  boardState: state.boardState,
  currentObject: state.currentObject,
  users: state.users,
  mapState: state.mapState
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ 
    createObject, 
    changeCurrentObject, 
    changeCurrentUser,
    changeMapLevel,
    changeObjectsLevel,
    changeBoardState 
  }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);