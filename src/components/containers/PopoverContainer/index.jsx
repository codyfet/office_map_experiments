import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteObject, turnObject } from '../../../actions/index';

class PopoverContainer extends React.Component {

    state = {
        editHandlerClicked: false
    }

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
      const { currentObject, editHandler } = this.props;
      let id = this.state.editHandlerClicked ? '' : currentObject.objectId;

      this.setState({
        editHandlerClicked: !this.state.editHandlerClicked
      },
      editHandler(id));
   
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
        turnObject 
    }, dispatch)
});
    
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopoverContainer);