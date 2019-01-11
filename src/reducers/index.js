import { combineReducers } from 'redux';
import furnitures from './furnitures';
import boardState from './boardState';

export default combineReducers({
  boardState,
  furnitures
});