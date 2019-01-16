import { combineReducers } from 'redux';
import objects from './objects';
import boardState from './boardState';

export default combineReducers({
  boardState,
  objects
});