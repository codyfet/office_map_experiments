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
      const { actions, objectId, readyHandler } = this.props;
      actions.deleteObject(objectId);
      readyHandler(); // close popover
      // console.log( 'You deleted an object with ID#', objectId );
    }

    rotateObject = () => {
      const { actions, objectId, readyHandler } = this.props;
      actions.turnObject(objectId);
      readyHandler(); // close popover
      // console.log( 'You turned an object with ID#', this.props.objectId );    
    }

    editObject = () => {
      const { objectId, editHandler } = this.props;
      let id = this.state.editHandlerClicked ? '' : objectId;

      this.setState({
        editHandlerClicked: !this.state.editHandlerClicked
      },
      editHandler(id));
      // readyHandler(); // close popover
      // console.log( 'You edited an object with ID#', this.props.objectId );
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
    boardState: state.boardState
});
    
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ deleteObject, turnObject }, dispatch)
});
    
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopoverContainer);