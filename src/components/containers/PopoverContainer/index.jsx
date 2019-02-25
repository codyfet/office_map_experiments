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
import DeleteObjectModal from '../DeleteObjectModal';

const _ = require('lodash');
// для генерирования уникальных id:
const genUniqId = require('uniqid');

class PopoverContainer extends React.Component {
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
    // если щелкнули - да, то удаляем объект(ы)
    const { actions, currentObject, readyHandler } = this.props;

    currentObject.objectId.split(' ').forEach(id => {
      actions.deleteObject(id);
    });

    this.closeModal();
    readyHandler(); // close popover
  };
  
  handleCloseModal = () => {
    this.closeModal();
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
    this.openModal();
  };

  rotateObject = () => {
    const { actions, currentObject } = this.props;

    currentObject.objectId.split(' ').forEach(id => {
      actions.turnObject(id);
    });
  };

  editObject = () => {
    // const { actions, currentObject } = this.props;
    // // повторное нажатие закрывает панель редактирования на SidePanel:
    // const newState = currentObject.state === 'none' ? 'edit' : 'none';
    // actions.changeCurrentObjectState(newState);
  };

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
    const { showModal } = this.state;

    return (
      <React.Fragment>
        <PopoverView
          x={x}
          y={y}
          readyHandler={readyHandler}
          copyHandler={this.copyObject}
          turnHandler={this.rotateObject}
          editHandler={this.editObject}
          deleteHandler={this.deleteObject}
        />
        <DeleteObjectModal
          visible={showModal}
          objectIds={currentObject.objectId}
          onYesClick={this.handleYesClickModal}
          onHide={this.handleCloseModal}
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
