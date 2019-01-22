import React from 'react';
import { Popover, Button } from 'react-bootstrap';
import IconSVG from '../../presentational/IconSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

const PopoverView = (props) => {

    const { x, y, readyHandler, turnHandler, editHandler, deleteHandler} = props;

    return (
        <Popover 
            id="popover-basic"
            placement="right"
            positionLeft={x}
            positionTop={y}
            animation="false"
        >
            <div style={{display: 'flex'}}>
                <IconSVG width="20px" content={iconPaths.ready} onClick={readyHandler}/>
                <IconSVG width="20px" content={iconPaths.turn} onClick={turnHandler} />
                <IconSVG width="20px" content={iconPaths.edit} onClick={editHandler} />
                <IconSVG width="20px" content={iconPaths.delete} onClick={deleteHandler} />
            </div> 
                          

        </Popover>


    );
    


};

export default PopoverView;