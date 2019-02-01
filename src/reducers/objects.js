import {
  CREATE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT,
  DELETE_OBJECT,
  UPDATE_USER,
  CHANGE_OBJECTS_LEVEL
} from "../res/constants";
import mapData from "../res/mapData.json";

const initialState = mapData.levels[1].movable;

export default function objects(state = initialState, action) {
  switch (action.type) {
    case CREATE_OBJECT:
      return [...state, action.payload];

    case DELETE_OBJECT:
      const newState = state.slice(0);
      const objectId = action.payload;
      return newState.filter(val => val.id !== objectId);

    case MOVE_OBJECT:
      const objectId = action.payload.id;
      const newPosition = action.payload.pos;

      const movedObject = state.find(val => val.id === objectId);
      if (movedObject !== undefined) {
        movedObject.coordinates = newPosition;
      }

      return state;

    case TURN_OBJECT:
      const objectId = action.payload;

      const object = state.find(val => val.id === objectId);
      if (object !== undefined) {
        let tempW = object.width;
        object.width = object.height;
        object.height = tempW;
      }

      return state;

    case CHANGE_OBJECTS_LEVEL:
      const level = action.payload;
      return mapData.levels[level].movable;

    case UPDATE_USER:
      const objectId = action.payload.id;
      const newUserId = action.payload.userId;

      const object = state.find(val => val.id === objectId);
      if (object !== undefined) {
        object.userId = newUserId;
      }

      return state;

    default:
      return state;
  }
}
