import {
  CREATE_OBJECT,
  CHANGE_BOARD_STATE,
  DELETE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT,
  UPDATE_USER,
  CHANGE_OBJECTS_LEVEL,
  CHANGE_CORRECT_LOCATION,
  CHANGE_ANY_OBJECT_DATA,
  SHIFT_OBJECTS,
  CHANGE_MAP_LEVEL,
  ADD_USER,
  EDIT_USER,
  DELETE_USER,
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER,
  CHANGE_CURRENT_OBJECT_STATE,
  CHANGE_WORK_MODE,
  CREATE_PROJECT
} from '../res/constants';

// actions wuth objects:
export const createObject = newObj => ({
  type: CREATE_OBJECT,
  payload: newObj,
});

export const moveObject = objData => ({
  type: MOVE_OBJECT,
  payload: objData,
});

export const turnObject = objectId => ({
  type: TURN_OBJECT,
  payload: objectId,
});

export const deleteObject = objectId => ({
  type: DELETE_OBJECT,
  payload: objectId,
});

export const updateUser = objData => ({
  type: UPDATE_USER,
  payload: objData,
});

export const changeObjectsLevel = level => ({
  type: CHANGE_OBJECTS_LEVEL,
  payload: level,
});

export const changeCorrectLocation = objData => ({
  type: CHANGE_CORRECT_LOCATION,
  payload: objData,
});

export const changeAnyObjectData = objData => ({
  type: CHANGE_ANY_OBJECT_DATA,
  payload: objData,
});

export const shiftObjects = objData => ({
  type: SHIFT_OBJECTS,
  payload: objData,
});

// actions with map:
export const changeMapLevel = level => ({
  type: CHANGE_MAP_LEVEL,
  payload: level,
});

// actions with board and panel:
export const changeBoardState = newState => ({
  type: CHANGE_BOARD_STATE,
  payload: newState,
});

export const changeCurrentObject = objectId => ({
  type: CHANGE_CURRENT_OBJECT,
  payload: objectId,
});

export const changeCurrentUser = userId => ({
  type: CHANGE_CURRENT_USER,
  payload: userId,
});

export const changeCurrentObjectState = newState => ({
  type: CHANGE_CURRENT_OBJECT_STATE,
  payload: newState,
});

// actions with users:
export const addUser = newUser => ({
  type: ADD_USER,
  payload: newUser,
});

export const editUser = userData => ({
  type: EDIT_USER,
  payload: userData,
});

export const deleteUser = userId => ({
  type: DELETE_USER,
  payload: userId,
});

// WORK_MODE:
export const changeWorkMode = newWM => ({
  type: CHANGE_WORK_MODE,
  payload: newWM,
});

// actions with projects:
export const createProject = (newProject) => ({
  type: CREATE_PROJECT,
  payload: newProject,
});
