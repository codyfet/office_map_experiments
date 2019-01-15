import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFurniture } from '../../../actions/index';

class PopoverContainer extends React.Component {

    deleteObject = () => {
      const { actions, objectId, readyHandler } = this.props;
      actions.deleteFurniture(objectId);
      readyHandler(); // close popover
      console.log( 'You deleted an object with ID#', objectId );
    }

    turnObject = () => {
      console.log( 'You turned an object with ID#', this.props.objectId );    
    }

    editObject = () => {
      console.log( 'You edited an object with ID#', this.props.objectId );
    }

    render() {
        const { x, y, readyHandler} = this.props;

        return (
            <PopoverView 
                x={x}
                y={y}
                readyHandler={readyHandler}
                turnHandler={this.turnObject}
                editHandler={this.editObject}
                deleteHandler={this.deleteObject}
                
            />
                
        );
    
    }    


};

// for redux:
const mapStateToProps = (state) => ({
    furnitures: state.furnitures,
    boardState: state.boardState
});
    
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ deleteFurniture }, dispatch)
});
    
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopoverContainer);