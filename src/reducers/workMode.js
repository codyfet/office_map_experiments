import { CHANGE_WORK_MODE } from '../res/constants';
import { SINGLE_EDIT } from '../res/workModeConstants';

const initialState = SINGLE_EDIT;

export default function workMode(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WORK_MODE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
