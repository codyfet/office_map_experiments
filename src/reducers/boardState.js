import { CHANGE_BOARD_STATE } from '../res/constants';

// в соответствии со вторым этажом:
const initialState = { shift: [4, 4], 
                       scale: 0.217 };

export default function boardState(state = initialState, action) {
  switch ( action.type ) {
    case CHANGE_BOARD_STATE: {
      return action.payload;  
    }
    default: {
      return state;
    }
  
  } 
}