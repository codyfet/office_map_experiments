import { 
  CREATE_OBJECT, 
  MOVE_OBJECT, 
  TURN_OBJECT, 
  DELETE_OBJECT 
} from '../res/constants';
import mapData from '../res/mapData.json';


const initialState = mapData.levels[1].movable;

export default function objects(state = initialState, action) {
  if ( action.type === CREATE_OBJECT ) {
    return [
      ...state,
      action.payload
    ];
  
  } else if ( action.type === DELETE_OBJECT ) {
    const newState = state.slice(0);
    const objectId = action.payload;
    return newState.filter( (val) => (val.id !== objectId) );
  
  } else if ( action.type === MOVE_OBJECT ) {
    const objectId = action.payload.id;
    const newPosition = action.payload.pos;
        
    const movedObject = state.find( (val) => (val.id === objectId) );
    if ( movedObject !== undefined ) {
      movedObject.coordinates = newPosition;
    }

    return state;

  } else if ( action.type === TURN_OBJECT ) {
    const objectId = action.payload;

    const object = state.find( (val) => (val.id === objectId) );
    if ( object !== undefined ) {
      let tempW = object.width; 
      object.width = object.height;
      object.height = tempW;
    } 

    return state;

  }
  return state;
}