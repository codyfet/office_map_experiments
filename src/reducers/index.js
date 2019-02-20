import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';
import users from './users';
import currentObject from './currentObject';
import mapState from './mapState';
import workMode from './workMode';

export default combineReducers({
  workMode,
  boardState,
  mapState,
  currentObject,
  users,
  objects,
});
