import { CREATE_OBJECT, MOVE_OBJECT, DELETE_OBJECT } from '../res/constants';

const initialState = [];

export default function objects(state = initialState, action) {
  if (action.type === CREATE_OBJECT) {
    return [
      ...state,
      action.payload
    ];
  
  } else if (action.type === DELETE_OBJECT) {
    const newState = state.slice(0);
    const ObjectId = action.payload;
    return newState.filter((val) => (val.id !== ObjectId));
  
  } else if (action.type === MOVE_OBJECT) {
    const ObjectId = action.payload.id;
    const newPosition = action.payload.pos;

    console.log(ObjectId, newPosition);
        
    const movedObject = state.find( (val) => (val.id === ObjectId) );
    if ( movedObject !== undefined ) {
      movedObject.coordinates = newPosition;
    } 

    return state;

  }
  return state;
}