import { ADD_USER, EDIT_USER, DELETE_USER } from "../res/constants";
import mapData from "../res/mapData.json";

const initialState = mapData.users;

export default function users(state = initialState, action) {
  switch ( action.type ) {
    case ADD_USER: {
      return [...state, action.payload];
    }
    
    case EDIT_USER: {
      return state;
    }
    case DELETE_USER: {
      return state;
    }
    default: {
      return state;
    }
    
  }

}
