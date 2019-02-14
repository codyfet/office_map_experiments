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
// загрузить lodash:
var _ = require('lodash');




class SidePanel extends React.Component {

  componentDidUpdate(prevProps){
    // для центрирования сцены при изменении level:
    if (prevProps.mapState !== this.props.mapState) {
      const { mapWidth, mapHeight } = this.props.mapState;
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
    // считаем используя отступ с 2-х сторон (поэтому * 2)
    let scaleX = boardWidth / (mapWidth + padding*2);
    let scaleY = boardHeight / (mapHeight + padding*2);
    console.log('scales', scaleX, scaleY);
    // если реальная карта меньше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY > 1),
    // то выберем наибольший масштаб:
    let newScale;
    if ( scaleX < 1 || scaleY < 1) {
      newScale = scaleX > scaleY ? scaleY : scaleX;
    } else {
      newScale = scaleX > scaleY ? scaleX : scaleY;
    }

    // сразу в redux:
    const { actions } = this.props;
    const newState = { 
      shift: [padding*newScale, padding*newScale], 
      scale: newScale            
    };

    actions.changeBoardState(newState);

  };

  onSaveMapClick = () => {
    const { objects, users } = this.props;
    // order for objects:
    const objectOrder = ["category", "title", "id", "coordinates", "width", "height", "movable", "correctLocation", "color"];
    
    // сохранение карты со всеми объектами и пользователями:
    // сначала подггрузим весь файл mapData:
    let mapDataFile = _.cloneDeep(mapData);
    
    // дополним его изменившимися данными:
    mapDataFile.levels = objects.levels.map( (objects, i) => {

      let levelData = Object.assign({}, mapDataFile.levels[i]);
      levelData.objects = objects.map( (obj, j) => {
        // запишем поля в алфавитном порядке:
        // console.log('fields obj:', obj);
        let formattedObject = {};
        objectOrder.forEach( property => {
          // console.log('fields obj:', obj);
          if ( obj[property] !== undefined ) {
            formattedObject[property] = obj[property];

          }
        });
        return formattedObject;
      });
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
        <Accordion className="mainAccordion">
          <AccordionItem
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded" 
            titleClassName="mainAccordion-item-title"

            title="Редактировать" 
            expanded={ currentObject.state !== 'none' } 
          >
            <CurrentObjectTab />
          </AccordionItem>

          <AccordionItem 
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded" 
            titleClassName="mainAccordion-item-title"

            title="Создать"
          >
            <CreateTab />
          </AccordionItem>

          <AccordionItem 
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded" 
            titleClassName="mainAccordion-item-title"

            title="Пользователи"
          >
            <UsersList />
          </AccordionItem>

          <AccordionItem 
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded" 
            titleClassName="mainAccordion-item-title"

            title="Карта"
          >
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