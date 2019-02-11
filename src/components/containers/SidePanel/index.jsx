import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'react-sanfona';
import { bindActionCreators } from 'redux';
import { changeBoardState, changeCurrentObject, changeCurrentUser, changeMapLevel, changeObjectsLevel, createObject } from '../../../actions/index';
import CreateTab from '../../containers/CreateTab/index';
import CurrentObjectTab from '../../containers/CurrentObjectTab/index';
import MapLevelItem from '../../containers/MapLevelItem/index';
import UsersList from '../ListsComponents/UsersList/index';
import mapData from '../../../res/mapData.json';

import './styles.css';

// для сохранения файлов:
var FileSaver = require('file-saver');
// // для генерирования уникальных id:
// var genUniqId = require('uniqid');
// загрузить lodash:
var _ = require('lodash');




class SidePanel extends React.Component {

  componentWillReceiveProps(nextProps){
    // для центрирования сцены при изменении level:
    if (nextProps.mapState !== this.props.mapState) {
      console.log('mapState receive props', nextProps.mapState);
      const { mapWidth, mapHeight } = nextProps.mapState;
      this.autoAdjustStage(mapWidth, mapHeight);
    }
  }

  // Авто-подстройка масштаба и сдвига под границы stage:
  autoAdjustStage = (mapWidth, mapHeight) => {
    // padding:
    const padding = 20;

    // получаем границы окна :
    const { boardWidth, boardHeight } = this.props;
    console.log('wh', boardWidth, boardHeight);

    // настраиваем масштаб:
    let scaleX = boardWidth / (mapWidth + padding);
    let scaleY = boardHeight / (mapHeight + padding);
    console.log('scales', scaleX, scaleY);
    const newScale = scaleX > scaleY ? scaleX : scaleY;

    // сразу в redux:
    const { actions } = this.props;
    const newState = { 
      shift: [0, 0], 
      scale: newScale            
    };

    actions.changeBoardState(newState);

  };

  onSaveMapClick = () => {
    const { objects, users } = this.props;
    // сохранение карты со всеми объектами и пользователями:
    // сначала подггрузим весь файл mapData:
    let mapDataFile = _.cloneDeep(mapData);
    console.log("mapData", mapData);
    // дополним его изменившимися данными:
    console.log("objects", objects);
    console.log("users", users);
    mapDataFile.levels = objects.levels.map( (objects, i) => {
      let levelData = Object.assign({}, mapDataFile.levels[i]);
      levelData.objects = objects;
      return levelData;

    });
    mapDataFile.users = users;
    console.log("changedMapData", mapDataFile);

    // предлагаем загрузку пользователю:
    var file = new File([JSON.stringify(mapDataFile)], "newMapData.json", {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(file);

    
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
    console.log("levelNumber", levelNumber);
    console.log('actionsBefore', actions);
    actions.changeMapLevel(levelNumber);
    actions.changeObjectsLevel(levelNumber);

  }

 

  render() {

    const { currentObject } = this.props;

    return (
      <div className="sidePanelContainer">
        {/* handle map level change: */}
        <MapLevelItem 
          currentLevel={this.props.mapState.mapLevel}
          onSelectLevel={this.onSelectLevel}

        />
        {/* accordeon: */}
        <Accordion>
          <AccordionItem 
            title="Редактировать" 
            expanded={ currentObject.state !== 'none' } 
          >
            <CurrentObjectTab />
          </AccordionItem>

          <AccordionItem title="Создать">
            <CreateTab />
          </AccordionItem>

          <AccordionItem title="Пользователи">
            <UsersList />
          </AccordionItem>

          <AccordionItem title="Карта">
            <button
              style={{width: '100%'}}
              onClick={this.onSaveMapClick}
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