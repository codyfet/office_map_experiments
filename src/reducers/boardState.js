import { CHANGE_BOARD_STATE } from '../res/constants';

const initialState = { shift: [0, 0], 
                       scale: 1 };

export default function boardState(state = initialState, action) {
  if (action.type === CHANGE_BOARD_STATE) {
    return action.payload;
  }
  return state;
}