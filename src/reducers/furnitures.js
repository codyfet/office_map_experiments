import { CREATE_FURNITURE, MOVE_FURNITURE, DELETE_FURNITURE } from '../res/constants';

const initialState = [];

export default function furnitures(state = initialState, action) {
  if (action.type === CREATE_FURNITURE) {
    return [
      ...state,
      action.payload
    ];
  
  } else if (action.type === DELETE_FURNITURE) {
    const newState = state.slice(0);
    const furnitureId = action.payload;
    return newState.filter((val) => (val.id !== furnitureId));
  
  } else if (action.type === MOVE_FURNITURE) {
    const furnitureId = action.payload.id;
    const newPosition = action.payload.pos;

    console.log(furnitureId, newPosition);
        
    const movedFurniture = state.find( (val) => (val.id === furnitureId) );
    if ( movedFurniture !== undefined ) {
      movedFurniture.coordinates = newPosition;
    } 

    return state;

  }
  return state;
}