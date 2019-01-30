import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';
import users from './users';
import currentObjectState from './currentObjectState';
import mapState from './mapState';

export default combineReducers({
  boardState,
  mapState,
  currentObjectState,
  users,
  objects
});