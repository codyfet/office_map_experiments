import { 
  CHANGE_CURRENT_OBJECT,
  CHANGE_CURRENT_USER,
  CHANGE_CURRENT_OBJECT_STATE
} from '../res/constants';

const initialState = { objectId: '', 
                       userId: '',
                       state: 'none' };

export default function currentObject(state = initialState, action) {
  switch ( action.type ) {
    case CHANGE_CURRENT_OBJECT: {
      state.objectId = action.payload;
      return state;
      
    }
    case CHANGE_CURRENT_USER: { 
      return {
        objectId: state.objectId, 
        userId: action.payload,
        state: action.payload
      };

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