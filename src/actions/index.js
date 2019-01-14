import {
  CREATE_FURNITURE,
  CHANGE_BOARD_STATE,
  DELETE_FURNITURE

} from '../res/constants';

export const createFurniture = (newFurn) => ({
  type: CREATE_FURNITURE,
  payload: newFurn
});

export const deleteFurniture = (furnitureId) => ({
  type: DELETE_FURNITURE,
  payload: furnitureId
});

export const changeBoardState = (newState) => ({
  type: CHANGE_BOARD_STATE,
  payload: newState
});
