import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';
import users from './users';
import currentObject from './currentObject';
import mapState from './mapState';

export default combineReducers({
  boardState,
  mapState,
  currentObject,
  users,
  objects
});