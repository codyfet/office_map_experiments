import { 
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER
} from '../res/constants';

const initialState = { objectId: '', 
                       userId: '' };

export default function currentObjectState(state = initialState, action) {
  if ( action.type === CHANGE_CURRENT_OBJECT ) {
    state.objectId = action.payload;
    return state;

  } else if ( action.type === CHANGE_CURRENT_USER ) {
    state.userId = action.payload;
    return state;
    
  }
  return state;
}