import { 
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER
} from '../res/constants';

const initialState = { objectId: '', 
                       userId: '',
                       state: 'none' };

export default function currentObjectState(state = initialState, action) {
  switch ( action.type ) {
    case CHANGE_CURRENT_OBJECT: {
      state.objectId = action.payload;
      return state;
      
    }
    case CHANGE_CURRENT_USER: { 
      state.userId = action.payload;
      return state;

    }
    case CHANGE_CURRENT_OBJECT_STATE: {
      return {
        objectId: state.objectId, 
        userId: state.userId,
        state: action.payload
      };

    }
    default: {
      return state;
    }
    
  }
}