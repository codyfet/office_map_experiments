import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import mapData from '../../../res/mapData.json';
import './styles.css';
import SaveMapModal from '../Modals/SaveMapModal/index';

// для сохранения файлов:
const FileSaver = require('file-saver');
// загрузить lodash:
const _ = require('lodash');


class SaveMapTab extends React.Component {
  // работа с модальным окном:
  state = {
    showModal: false
  }

  openModal = () => {
    this.setState({
      showModal: true
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false
    });
  }

  handleYesClickModal = () => {
    this.saveCurrentMap();
    this.closeModal();
  };
  
  handleCloseModal = () => {
    this.closeModal();
  };

  saveCurrentMap = () => {
    const { objects, users, projects } = this.props;
    // order for objects:
    const objectOrder = [
      'category',
      'id',
      'title',
      'isCompound',
      'coordinates',
      'polygonPoints',
      'width',
      'height',
      'composition',
      'seatLocation',
      'orientation',
      'doorLocation',
      'doorPosition',
      'iconPosition',
      'color',
      'movable',
      'hasIntersection',
      'enterpriseId',
      'about',
      'fullInfo'
    ];

    // сохранение карты со всеми объектами и пользователями:
    // сначала подггрузим весь файл mapData:
    const mapDataFile = _.cloneDeep(mapData);

    // дополним его изменившимися данными:
    mapDataFile.levels = objects.levels.map((objs, i) => {
      const levelData = _.cloneDeep(mapDataFile.levels[i]);
      levelData.objects = objs.map((obj) => {
        // запишем поля в определенном порядке:
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
    mapDataFile.projects = projects;

    // предлагаем загрузку пользователю:
    const file = new File([JSON.stringify(mapDataFile)], 'newMapData.json', {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(file);
  };

  handleSaveMapButton = () => {
    this.openModal();
  }


  render() {
    const { showModal } = this.state;

    return (
      <React.Fragment>
        <div className="saveMapContainer">
          <button type="submit" className="buttonSaveMap" onClick={this.handleSaveMapButton}>
            Сохранить карту
          </button>
        </div>
        <SaveMapModal
          visible={showModal}
          onYesClick={this.handleYesClickModal}
          onHide={this.handleCloseModal}
        />
      </React.Fragment>
      
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  users: state.users,
  objects: state.objects,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveMapTab);
