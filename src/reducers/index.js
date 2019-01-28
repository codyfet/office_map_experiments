import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';
import users from './users';
import currentObjectState from './currentObjectState';

export default combineReducers({
  boardState,
  currentObjectState,
  users,
  objects
});