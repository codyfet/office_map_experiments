import React from 'react';
import { Popover } from 'react-bootstrap';
import AdvancedSVG from '../AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

const PopoverView = props => {
  const { x, y, readyHandler, copyHandler, turnHandler, editHandler, deleteHandler } = props;

  return (
    <Popover
      id="popover-basic"
      placement="right"
      positionLeft={x}
      positionTop={y}
      animation="false"
    >
      <div style={{ display: 'flex' }}>
        <AdvancedSVG width="20px" content={iconPaths.ready} onClick={readyHandler} />
        <AdvancedSVG width="20px" content={iconPaths.copy} onClick={copyHandler} />
        <AdvancedSVG width="20px" content={iconPaths.turn} onClick={turnHandler} />
        <AdvancedSVG width="20px" content={iconPaths.edit} onClick={editHandler} />
        <AdvancedSVG width="20px" content={iconPaths.delete} onClick={deleteHandler} />
      </div>
    </Popover>
  );
};

export default PopoverView;
