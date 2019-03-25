import React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  createObject,
  deleteObject,
  turnObject,
  changeCurrentObjectState,
} from '../../../actions/index';

import PopoverView from '../../presentational/PopoverView/index';
import DeleteObjectModal from '../Modals/DeleteObjectModal/index';
import MergeObjectsModal from '../Modals/MergeObjectsModal';
import mergeObjects from '../../../utils/mergeObjects';
import checkObjectsAdjoined from '../../../utils/checkObjectsAdjoined';
import { MULTI_EDIT } from '../../../res/workModeConstants';

const _ = require('lodash');
// для генерирования уникальных id:
const genUniqId = require('uniqid');

class PopoverContainer extends React.Component {
  // работа с модальным окном:
  state = {
    showDeleteModal: false,
    showMergeModal: false
  }

  // МОДУЛЬНОЕ ОКНО ДЛЯ УДАЛЕНИЯ:
  openDeleteModal = () => {
    this.setState({
      showDeleteModal: true
    });
  }

  closeDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  }

  handleYesClickModal = () => {
    // если щелкнули - да, то удаляем объект(ы)
    const { actions, currentObject, readyHandler } = this.props;

    currentObject.objectId.split(' ').forEach(id => {
      actions.deleteObject(id);
    });

    this.closeDeleteModal();
    readyHandler(); // close popover
  };
  
  handleCloseModal = () => {
    this.closeDeleteModal();
  };

  // МОДУЛЬНОЕ ОКНО ДЛЯ ОБЪЕДИНЕНИЯ:
  openMergeModal = () => {
    this.setState({
      showMergeModal: true
    });
  }

  closeMergeModal = () => {
    this.setState({
      showMergeModal: false
    });
  }

  handleChoiceMergeModal = (category) => {
    const { objects, actions, mapState, currentObject, readyHandler } = this.props;
    // если объект не выбран:
    if (category === '') {
      alert('ОШИБКА: ФИНАЛЬНЫЙ ТИП ОБЪЕКТА СЛИЯНИЯ НЕ БЫЛ ВЫБРАН!');
      return;
    } 

    let selectedObjects = [];
    // найдём выделенные объекты:
    const thisLevelObjects = objects.levels[objects.mapLevel];
    thisLevelObjects.forEach((elem) => {
      if (currentObject.objectId.split(' ').includes(elem.id)) {
        selectedObjects.push(_.cloneDeep(elem));
      }
    });

    // compound-объекты нельзя объединять
    if (selectedObjects.some((object) => object.isCompound)) {
      alert('ОШИБКА: СОСТАВНЫЕ ОБЪЕКТЫ НЕ ПОДХОДЯТ ДЛЯ ОБЪЕДИНЕНИЯ!');
      readyHandler(); // close popover
      return;
    }

    // если объекты не создают цепь, касаясь друг друга, то они не смогут сформировать единый объект:
    if (!checkObjectsAdjoined(selectedObjects)) {
      alert('ОШИБКА: ВЫДЕЛЕННЫЕ ОБЪЕКТЫ НЕ ПОДХОДЯТ ДЛЯ ОБЪЕДИНЕНИЯ!');
      readyHandler(); // close popover
      return;
    } 
    
    // если выделенные объекты могут создать единый объект, то:
    // объединяем их:
    const step = mapState.blockSnapSize;
    const newComplexObject = mergeObjects(selectedObjects, step, category);

    // удаляем выделенные объекты:
    currentObject.objectId.split(' ').forEach(id => {
      actions.deleteObject(id);
    });
    // добавляем новый:
    actions.createObject(_.cloneDeep(newComplexObject));
    // если объект выбран - то выполняем действия:

    // currentObject.objectId.split(' ').forEach(id => {
    //   actions.deleteObject(id);
    // });

    readyHandler(); // close popover
  };
  
  handleСloseMergeModal = () => {
    this.closeMergeModal();
  };

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  copy = object => {
    const { actions } = this.props;

    // сделаем копию:
    const newObject = _.cloneDeep(object);

    // никаких проверок не нужно - мы знаем точно, что объект существует
    // новые координаты получим сдвигом вправо вниз на:
    const shift = 30;
    newObject.coordinates = {
      x: object.coordinates.x + shift,
      y: object.coordinates.y + shift,
    };
    // если есть информация про пользователя - занулим:
    if (newObject.userId !== undefined) {
      newObject.userId = '';
    }
    // сгенерим новый id:
    newObject.id = genUniqId();
    actions.createObject(newObject);
  };

  // ОБРАБОТЧИКИ КНОПОК:
  deleteObject = () => {
    this.openDeleteModal();
  };

  rotateObject = () => {
    const { actions, currentObject } = this.props;

    currentObject.objectId.split(' ').forEach(id => {
      actions.turnObject(id);
    });
  };

  connectObjects = () => {
    const { workMode } = this.props;
    // работает только при групповом выделении:
    if (workMode === MULTI_EDIT) {
      // объединяет/разъединяет объекты
      this.openMergeModal();
    }
  }

  copyObject = () => {
    const { objects, currentObject } = this.props;

    const thisLevelObjects = objects.levels[objects.mapLevel];
    thisLevelObjects.forEach(elem => {
      if (currentObject.objectId.split(' ').includes(elem.id)) {
        this.copy(elem);
      }
    });
  };

  render() {
    const { x, y, readyHandler, currentObject } = this.props;
    const { showDeleteModal, showMergeModal } = this.state;

    return (
      <React.Fragment>
        <PopoverView
          x={x}
          y={y}
          readyHandler={readyHandler}
          copyHandler={this.copyObject}
          turnHandler={this.rotateObject}
          connectHandler={this.connectObjects}
          deleteHandler={this.deleteObject}
        />
        <DeleteObjectModal
          visible={showDeleteModal}
          objectIds={currentObject.objectId}
          onYesClick={this.handleYesClickModal}
          onHide={this.handleCloseModal}
        />
        <MergeObjectsModal
          visible={showMergeModal}
          objectIds={currentObject.objectId}
          onConfirmClick={this.handleChoiceMergeModal}
          onHide={this.handleСloseMergeModal}
        />
      </React.Fragment>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  boardState: state.boardState,
  currentObject: state.currentObject,
  workMode: state.workMode,
  mapState: state.mapState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      createObject,
      deleteObject,
      turnObject,
      changeCurrentObjectState,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopoverContainer);
