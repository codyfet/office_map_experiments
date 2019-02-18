import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';
import createMapObject from '../../../utils/objectsFactory';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject, deleteObject, turnObject, changeCurrentObjectState } from '../../../actions/index';
import workMode from './../../../reducers/workMode';

var _ = require('lodash');
// для генерирования уникальных id:
var genUniqId = require('uniqid');


class PopoverContainer extends React.Component {
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
    copy = (object) => {
      const { actions } = this.props;
    
      // сделаем копию:
      let newObject = _.cloneDeep(object);

      // никаких проверок не нужно - мы знаем точно, что объект существует
      // новые координаты получим сдвигом вправо вниз на:
      const shift = 30;
      newObject.coordinates = { 
        x: object.coordinates.x + shift, 
        y: object.coordinates.y + shift
      };
      // если есть информация про пользователя - занулим:
      if (newObject.userId !== undefined) {
        newObject.userId = '';
      }
      // сгенерим новый id:
      newObject.id = genUniqId();
      actions.createObject(newObject);


    }

    // ОБРАБОТЧИКИ КНОПОК:
    deleteObject = () => {
      const {
        actions,
        currentObject,
        readyHandler 
      } = this.props;

      currentObject.objectId.split(' ').forEach( id => {
        actions.deleteObject(id);
      });
      
      readyHandler(); // close popover
      
    }

    rotateObject = () => {
      const { 
        actions, 
        currentObject,
        readyHandler 
      } = this.props;

      currentObject.objectId.split(' ').forEach( id => {
        actions.turnObject(id);
      });

    }

    editObject = () => {
      // const { actions, currentObject } = this.props;
      // // повторное нажатие закрывает панель редактирования на SidePanel:
      // const newState = currentObject.state === 'none' ? 'edit' : 'none';
      // actions.changeCurrentObjectState(newState);
   
    }

    copyObject = () => {
      const { objects, currentObject } = this.props;
      
      const thisLevelObjects = objects.levels[objects.mapLevel];
      thisLevelObjects.forEach( elem => {
        if ( currentObject.objectId.split(' ').includes(elem.id) ) {
          this.copy(elem);
        }
      });
      

    }

    render() {
        const { x, y, readyHandler} = this.props;

        return (
            <PopoverView 
                x={x}
                y={y}
                readyHandler={readyHandler}
                copyHandler={this.copyObject}
                turnHandler={this.rotateObject}
                editHandler={this.editObject}
                deleteHandler={this.deleteObject}
                
            />
                
        );
    
    }    


};

// for redux:
const mapStateToProps = (state) => ({
    objects: state.objects,
    boardState: state.boardState,
    currentObject: state.currentObject,
    workMode: state.workMode
});
    
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ 
        createObject,
        deleteObject, 
        turnObject,
        changeCurrentObjectState 
    }, dispatch)
});
    
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopoverContainer);