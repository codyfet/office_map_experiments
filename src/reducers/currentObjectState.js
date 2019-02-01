import { 
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER
} from '../res/constants';

const initialState = { objectId: '', 
                       userId: '' };

export default function currentObjectState(state = initialState, action) {
  switch ( action.type ) {
    case CHANGE_CURRENT_OBJECT:
      state.objectId = action.payload;
      return state;
    
    case CHANGE_CURRENT_USER: 
      state.userId = action.payload;
      return state;
    
    default:
      return state;
  }
}