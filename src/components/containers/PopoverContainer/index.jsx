import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';
import createMapObject from '../../../utils/objectsFactory';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject, deleteObject, turnObject, changeCurrentObjectState } from '../../../actions/index';

var _ = require('lodash');
// для генерирования уникальных id:
var genUniqId = require('uniqid');


class PopoverContainer extends React.Component {

    deleteObject = () => {
      const { 
        actions, 
        currentObject,
        readyHandler 
      } = this.props;

      actions.deleteObject(currentObject.objectId);
      readyHandler(); // close popover
      
    }

    rotateObject = () => {
      const { 
        actions, 
        currentObject,
        readyHandler 
      } = this.props;

      actions.turnObject(currentObject.objectId);

    }

    editObject = () => {
      // const { actions, currentObject } = this.props;
      // // повторное нажатие закрывает панель редактирования на SidePanel:
      // const newState = currentObject.state === 'none' ? 'edit' : 'none';
      // actions.changeCurrentObjectState(newState);
   
    }

    copyObject = () => {
      const { actions, objects, currentObject } = this.props;
      
      const thisLevelObjects = objects.levels[objects.mapLevel];
      const requiredObject = thisLevelObjects.find( val => val.id === currentObject.objectId );
      // сделаем копию:
      let newObject = _.cloneDeep(requiredObject);

      // никаких проверок не нужно - мы знаем точно, что объект существует
      // новые координаты получим сдвигом вправо вниз на:
      const shift = 30;
      newObject.coordinates = { 
        x: requiredObject.coordinates.x + shift, 
        y: requiredObject.coordinates.y + shift
      };
      // если есть информация про пользователя - занулим:
      if (newObject.userId !== undefined) {
        newObject.userId = '';
      }
      // сгенерим новый id:
      newObject.id = genUniqId();

      
      // console.log('newObject', newObject);
      actions.createObject(newObject);

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
    currentObject: state.currentObject
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