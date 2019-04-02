import * as React from 'react';
import axios from 'axios';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import mapData from '../../../res/mapData.json';
import './styles.css';
import DownloadMapModal from '../Modals/DownloadMapModal/index';
import SaveMapModal from '../Modals/SaveMapModal/index';

// для сохранения файлов:
const FileSaver = require('file-saver');
// загрузить lodash:
const _ = require('lodash');


class SaveMapTab extends React.Component {
  // работа с модальным окном:
  state = {
    showDownloadModal: false,
    showSaveModal: false
  }

  openDownloadModal = () => {
    this.setState({
      showDownloadModal: true
    });
  }

  openSaveModal = () => {
    this.setState({
      showDownloadModal: true,
      showSaveModal: true
    });
  }

  closeModals = () => {
    this.setState({
      showDownloadModal: false,
      showSaveModal: false
    });
  }

  handleYesClickDownloadModal = () => {
    this.downloadCurrentMap();
    this.closeModals();
  };

  handleYesClickSaveModal = () => {
    this.saveCurrentMap();
    this.closeModals();
  };

  // вспомогательная функция, возвращает обновленную карту:
  getUpdatedMapData = () => {
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
      'userId',
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

    return mapDataFile;
  }

  downloadCurrentMap = () => {
    const mapDataFile = this.getUpdatedMapData();
    // предлагаем загрузку пользователю:
    const file = new File([JSON.stringify(mapDataFile)], 'newMapData.json', {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(file);
  };

  saveCurrentMap = () => {
    const mapDataFile = this.getUpdatedMapData();
    // отослать данные на back-end
    axios.post('http://127.0.0.1:8081/newMapData', mapDataFile)
      .then((response) => {
        alert(`${response.data.message}`);
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  handleDownloadMapButton = () => {
    this.openDownloadModal();
  }

  handleSaveMapButton = () => {
    this.openSaveModal();
  }


  render() {
    const { showDownloadModal, showSaveModal } = this.state;

    return (
      <React.Fragment>
        <div className="saveMapContainer">
          <button type="submit" className="buttonDownloadMap" onClick={this.handleDownloadMapButton}>
            Скачать карту
          </button>
          <button type="submit" className="buttonSaveMap" onClick={this.handleSaveMapButton}>
            Сохранить карту
          </button>
        </div>
        <DownloadMapModal
          visible={showDownloadModal}
          onYesClick={this.handleYesClickDownloadModal}
          onHide={this.closeModals}
        />
        <SaveMapModal
          visible={showSaveModal}
          onYesClick={this.handleYesClickSaveModal}
          onHide={this.closeModals}
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
