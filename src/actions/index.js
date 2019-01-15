import {
  CREATE_FURNITURE,
  CHANGE_BOARD_STATE,
  DELETE_FURNITURE,
  MOVE_FURNITURE

} from '../res/constants';

export const createFurniture = (newFurn) => ({
  type: CREATE_FURNITURE,
  payload: newFurn
});

export const moveFurniture = (furnData) => ({
  type: MOVE_FURNITURE,
  payload: furnData
}); 

export const deleteFurniture = (furnitureId) => ({
  type: DELETE_FURNITURE,
  payload: furnitureId
});

export const changeBoardState = (newState) => ({
  type: CHANGE_BOARD_STATE,
  payload: newState
});
