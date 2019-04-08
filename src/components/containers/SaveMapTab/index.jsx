import cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';
import axios from 'axios';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateObjectsFromServer,
  updateMapDescriptionFromServer,
  updateUsersFromServer,
  updateProjectsFromServer
} from '../../../actions/index';

import mapData from '../../../res/mapData.json';
import './styles.css';
import DownloadMapModal from '../Modals/DownloadMapModal/index';
import SaveMapModal from '../Modals/SaveMapModal/index';
import MapServices from '../../../services/MapServices';

// для сохранения файлов:
const FileSaver = require('file-saver');


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
    const { objects, mapState, users, projects } = this.props;
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
    const mapDataFile = {};

    // дополним его изменившимися данными:
    mapDataFile.projects = projects.data;
    mapDataFile.users = users.data;

    mapDataFile.levels = objects.levels.map((objs, i) => {
      let levelData = cloneDeep(mapState.description[i]);
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
    MapServices.sendMapData(mapDataFile)
      .then((response) => {
        alert(`${response.data.message}`);
      })
      .catch((error) => {
        alert(`${error}`);
      });
  }

  handleDownloadMapButton = () => {
    this.openDownloadModal();
  }

  handleSaveMapButton = () => {
    this.openSaveModal();
  }

  handleUpdateMap = () => {
    const { actions } = this.props;

    actions.updateObjectsFromServer();
    actions.updateMapDescriptionFromServer();
    actions.updateUsersFromServer();
    actions.updateProjectsFromServer();
  }


  render() {
    const { showDownloadModal, showSaveModal } = this.state;

    return (
      <React.Fragment>
        <div className="saveMapContainer">
          <button type="submit" className="buttonForSidePanel" onClick={this.handleDownloadMapButton}>
            Скачать
          </button>
          <button type="submit" className="buttonForSidePanel" onClick={this.handleSaveMapButton}>
            Сохранить
          </button>
          <button type="submit" className="buttonForSidePanel" onClick={this.handleUpdateMap}>
            Обновить
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
  mapState: state.mapState,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    updateObjectsFromServer,
    updateMapDescriptionFromServer,
    updateUsersFromServer,
    updateProjectsFromServer
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveMapTab);
