import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';
import users from './users';

export default combineReducers({
  boardState,
  users,
  objects
});