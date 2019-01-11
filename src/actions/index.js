import {
  CREATE_FURNITURE,
  CHANGE_BOARD_STATE

} from '../res/constants';

export const createFurniture = (newFurn) => ({
  type: CREATE_FURNITURE,
  payload: newFurn
});

export const changeBoardState = (newState) => ({
  type: CHANGE_BOARD_STATE,
  payload: newState
});
