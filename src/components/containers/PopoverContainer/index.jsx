import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteObject, turnObject, changeCurrentObjectState } from '../../../actions/index';

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
      readyHandler();

    }

    editObject = () => {
      const { actions, currentObject } = this.props;
      // повторное нажатие закрывает панель редактирования на SidePanel:
      const newState = currentObject.state === 'none' ? 'edit' : 'none';
      actions.changeCurrentObjectState(newState);
   
    }

    render() {
        const { x, y, readyHandler} = this.props;

        return (
            <PopoverView 
                x={x}
                y={y}
                readyHandler={readyHandler}
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
        deleteObject, 
        turnObject,
        changeCurrentObjectState 
    }, dispatch)
});
    
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopoverContainer);