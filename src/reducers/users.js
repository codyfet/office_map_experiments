import { ADD_USER, EDIT_USER, DELETE_USER } from "../res/constants";
import mapData from "../res/mapData.json";
// загрузить lodash:
var _ = require('lodash');

// загрузка объектов всех уровней:
const mapDataCloned = _.cloneDeep(mapData);
const initialState = mapDataCloned.users;

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
