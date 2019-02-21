import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'react-sanfona';
import { bindActionCreators } from 'redux';
import {
  changeBoardState,
  changeCurrentObject,
  changeCurrentUser,
  changeMapLevel,
  changeObjectsLevel,
  createObject,
} from '../../../actions/index';

import CreateTab from '../CreateTab/index';
import CurrentObjectTab from '../CurrentObjectTab/index';
import MapLevelItem from '../MapLevelItem/index';
import UsersEditList from '../ListsComponents/UsersEditList/index';
import mapData from '../../../res/mapData.json';
import './styles.css';

// для сохранения файлов:
const FileSaver = require('file-saver');
// загрузить lodash:
const _ = require('lodash');

class SidePanel extends React.Component {
  componentDidUpdate(prevProps) {
    const { mapState } = this.props;
    // для центрирования сцены при изменении level:
    if (prevProps.mapState !== mapState) {
      const { mapWidth, mapHeight } = mapState;
      this.autoAdjustStage(mapWidth, mapHeight);
    }
  }

  // Авто-подстройка масштаба и сдвига под границы stage:
  autoAdjustStage = (mapWidth, mapHeight) => {
    // padding:
    const padding = 20;

    // получаем границы окна :
    const { boardWidth, boardHeight } = this.props;
    
    // настраиваем масштаб:
    // считаем используя отступ с 2-х сторон (поэтому * 2)
    const scaleX = boardWidth / (mapWidth + padding * 2);
    const scaleY = boardHeight / (mapHeight + padding * 2);
    
    // если реальная карта меньше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY > 1),
    // то выберем наибольший масштаб:
    let newScale;
    if (scaleX < 1 || scaleY < 1) {
      newScale = scaleX > scaleY ? scaleY : scaleX;
    } else {
      newScale = scaleX > scaleY ? scaleX : scaleY;
    }

    // сразу в redux:
    const { actions } = this.props;
    const newState = {
      shift: [padding * newScale, padding * newScale],
      scale: newScale,
    };

    actions.changeBoardState(newState);
  };

  onSaveMapClick = () => {
    const { objects, users } = this.props;
    // order for objects:
    const objectOrder = [
      'category',
      'title',
      'id',
      'coordinates',
      'width',
      'height',
      'color',
      'movable',
      'correctLocation',
      'userId',
    ];

    // сохранение карты со всеми объектами и пользователями:
    // сначала подггрузим весь файл mapData:
    const mapDataFile = _.cloneDeep(mapData);

    // дополним его изменившимися данными:
    mapDataFile.levels = objects.levels.map((objs, i) => {
      const levelData = Object.assign({}, mapDataFile.levels[i]);
      levelData.objects = objs.map((obj) => {
        // запишем поля в алфавитном порядке:
        const formattedObject = {};
        objectOrder.forEach(property => {
          if (obj[property] !== undefined) {
            formattedObject[property] = obj[property];
          }
        });
        return formattedObject;
      });
      return levelData;
    });

    mapDataFile.users = users;
    

    // предлагаем загрузку пользователю:
    const file = new File([JSON.stringify(mapDataFile)], 'newMapData.json', {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(file);
  };

  // FOR REDUX:
  // обнулить состояние:
  cleanCurrentObjectState = () => {
    const { actions } = this.props;
    actions.changeCurrentObject('');
    actions.changeCurrentUser(''); 
  };

  // изменить уровень (этаж здания)
  onSelectLevel = levelNumber => {
    this.cleanCurrentObjectState();

    const { actions } = this.props; 
    actions.changeMapLevel(levelNumber);
    actions.changeObjectsLevel(levelNumber);
  };

  render() {
    const { currentObject, panelWidth, panelHeight, mapState } = this.props;

    return (
      <div
        className="sidePanelContainer"
        style={{
          width: `${panelWidth}px`,
          height: `${panelHeight}px`,
        }}
      >
        {/* handle map level change: */}
        <MapLevelItem
          currentLevel={mapState.mapLevel}
          onSelectLevel={this.onSelectLevel}
        />
        {/* accordeon: */}
        <Accordion className="mainAccordion">
          <AccordionItem
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded"
            titleClassName="mainAccordion-item-title"
            title="Редактировать"
            expanded={currentObject.state !== 'none'}
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
            <UsersEditList />
          </AccordionItem>

          <AccordionItem
            bodyClassName="mainAccordion-item-body-wrapper"
            expandedClassName="mainAccordion-item-expanded"
            titleClassName="mainAccordion-item-title"
            title="Карта"
          >
            <button type="submit" style={{ width: '100%' }} onClick={this.onSaveMapClick}>
              Сохранить карту
            </button>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  boardState: state.boardState,
  currentObject: state.currentObject,
  users: state.users,
  mapState: state.mapState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      createObject,
      changeCurrentObject,
      changeCurrentUser,
      changeMapLevel,
      changeObjectsLevel,
      changeBoardState,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidePanel);
