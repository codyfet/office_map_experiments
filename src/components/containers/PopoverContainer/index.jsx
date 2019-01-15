import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFurniture } from '../../../actions/index';

export class PopoverContainer extends React.Component {
    
    deleteHandler() {

    }

    render() {
        const { x, y, readyHandler, turnHandler, editHandler, deleteHandler} = this.props;

        return (
            <PopoverView 
                x={x}
                y={y}
                readyHandler={readyHandler}
                turnHandler={turnHandler}
                editHandler={editHandler}
                deleteHandler={deleteHandler}
                
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