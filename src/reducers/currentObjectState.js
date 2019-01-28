import { CHANGE_CURRENT_OBJECT_STATE } from '../res/constants';

const initialState = { selectedObjectId: '', 
                       selectedUserId: '' };

export default function boardState(state = initialState, action) {
  if (action.type === CHANGE_CURRENT_OBJECT_STATE) {
    return action.payload;
  }
  return state;
}