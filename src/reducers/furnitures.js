import { CREATE_FURNITURE, DELETE_FURNITURE } from '../res/constants';

const initialState = [];

export default function furnitures(state = initialState, action) {
  if (action.type === CREATE_FURNITURE) {
    return [
      ...state,
      action.payload
    ];
  } else if (action.type === DELETE_FURNITURE) {

    return [];
  }
  return state;
}