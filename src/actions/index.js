import {
  CREATE_OBJECT,
  DELETE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT,
  UPDATE_USER,
  CHANGE_OBJECTS_LEVEL,
  SET_HAS_INTERSECTION,
  CHANGE_ANY_OBJECT_DATA,
  SHIFT_OBJECTS,
  OBJECTS_LOADING,
  UPDATE_OBJECTS_FROM_SERVER,
  
  CHANGE_BOARD_STATE,
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER,
  CHANGE_CURRENT_OBJECT_STATE,

  CHANGE_MAP_LEVEL,
  MAP_DESCRIPTION_LOADING,
  UPDATE_MAP_DESCRIPTION_FROM_SERVER,

  ADD_USER,
  EDIT_USER,
  DELETE_USER,
  USERS_LOADING,
  UPDATE_USERS_FROM_SERVER,

  CHANGE_WORK_MODE,

  CREATE_PROJECT,
  PROJECTS_LOADING,
  UPDATE_PROJECTS_FROM_SERVER,
} from '../res/constants';
import MapServices from '../services/MapServices';

// actions wuth objects:
export const createObject = (newObj) => ({
  type: CREATE_OBJECT,
  payload: newObj,
});

export const moveObject = (objData) => ({
  type: MOVE_OBJECT,
  payload: objData,
});

export const turnObject = (objectId) => ({
  type: TURN_OBJECT,
  payload: objectId,
});

export const deleteObject = (objectId) => ({
  type: DELETE_OBJECT,
  payload: objectId,
});

export const updateUser = (objData) => ({
  type: UPDATE_USER,
  payload: objData,
});

export const changeObjectsLevel = (level) => ({
  type: CHANGE_OBJECTS_LEVEL,
  payload: level,
});

export const setHasIntersection = (objData) => ({
  type: SET_HAS_INTERSECTION,
  payload: objData,
});

export const changeAnyObjectData = (objData) => ({
  type: CHANGE_ANY_OBJECT_DATA,
  payload: objData,
});

export const shiftObjects = (objData) => ({
  type: SHIFT_OBJECTS,
  payload: objData,
});

export const showObjectsLoading = () => ({
  type: OBJECTS_LOADING,
  payload: true
});

export const updateObjectsFromServer = () => {
  return (dispatch) => {
    dispatch(showObjectsLoading());
    dispatch({
      type: UPDATE_OBJECTS_FROM_SERVER,
      payload: new Promise((resolve, reject) => {
        const data = MapServices.fetchObjectsData();
        resolve(data);
      })  
    });  
  };
};

// actions with map:
export const changeMapLevel = (level) => ({
  type: CHANGE_MAP_LEVEL,
  payload: level,
});

export const showMapDescriptionLoading = () => ({
  type: MAP_DESCRIPTION_LOADING,
  payload: true
});

export const updateMapDescriptionFromServer = () => {
  return (dispatch) => {
    dispatch(showMapDescriptionLoading());
    dispatch({
      type: UPDATE_MAP_DESCRIPTION_FROM_SERVER,
      payload: new Promise((resolve, reject) => {
        const data = MapServices.fetchMapDescriptionData();
        resolve(data);
      })  
    });  
  };
};

// actions with board and panel:
export const changeBoardState = (newState) => ({
  type: CHANGE_BOARD_STATE,
  payload: newState,
});

export const changeCurrentObject = (objectId) => ({
  type: CHANGE_CURRENT_OBJECT,
  payload: objectId,
});

export const changeCurrentUser = (userId) => ({
  type: CHANGE_CURRENT_USER,
  payload: userId,
});

export const changeCurrentObjectState = (newState) => ({
  type: CHANGE_CURRENT_OBJECT_STATE,
  payload: newState,
});

// actions with users:
export const addUser = (newUser) => ({
  type: ADD_USER,
  payload: newUser,
});

export const editUser = (userData) => ({
  type: EDIT_USER,
  payload: userData,
});

export const deleteUser = (userId) => ({
  type: DELETE_USER,
  payload: userId,
});

export const showUsersLoading = () => ({
  type: USERS_LOADING,
  payload: true
});

export const updateUsersFromServer = () => {
  return (dispatch) => {
    dispatch(showUsersLoading());
    dispatch({
      type: UPDATE_USERS_FROM_SERVER,
      payload: new Promise((resolve, reject) => {
        const data = MapServices.fetchUsersData();
        resolve(data);
      })
    });  
  };
};

// WORK_MODE:
export const changeWorkMode = (newWM) => ({
  type: CHANGE_WORK_MODE,
  payload: newWM,
});

// actions with projects:
export const createProject = (newProject) => ({
  type: CREATE_PROJECT,
  payload: newProject,
});

export const showProjectsLoading = () => ({
  type: PROJECTS_LOADING,
  payload: true
});

export const updateProjectsFromServer = () => {
  return (dispatch) => {
    dispatch(showProjectsLoading());
    dispatch({
      type: UPDATE_PROJECTS_FROM_SERVER,
      payload: new Promise((resolve, reject) => {
        const data = MapServices.fetchProjectsData();
        resolve(data);
      })  
    });  
  };
};
