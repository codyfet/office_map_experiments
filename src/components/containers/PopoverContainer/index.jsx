import React from 'react';
import PopoverView from '../../presentational/PopoverView/index';

class PopoverContainer extends React.Component {

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

export default PopoverView;