import {
  CREATE_OBJECT,
  CHANGE_BOARD_STATE,
  DELETE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT

} from '../res/constants';

export const createObject = (newObj) => ({
  type: CREATE_OBJECT,
  payload: newObj
});

export const moveObject = (objData) => ({
  type: MOVE_OBJECT,
  payload: objData
}); 

export const turnObject = (objectId) => ({
  type: TURN_OBJECT,
  payload: objectId
});

export const deleteObject = (objectId) => ({
  type: DELETE_OBJECT,
  payload: objectId
});

export const changeBoardState = (newState) => ({
  type: CHANGE_BOARD_STATE,
  payload: newState
});
