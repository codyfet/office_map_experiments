import { ADD_USER, EDIT_USER, DELETE_USER } from "../res/constants";
import mapData from "../res/mapData.json";

const initialState = mapData.users;

export default function users(state = initialState, action) {
  if (action.type === ADD_USER) {
    return [...state, action.payload];

  } else if (action.type === EDIT_USER) {
    return state;

  } else if (action.type === DELETE_USER) {
    return state;
    
  }
  return state;
}
