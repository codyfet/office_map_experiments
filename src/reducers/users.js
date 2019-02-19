import { ADD_USER, EDIT_USER, DELETE_USER } from "../res/constants";
import mapData from "../res/mapData.json";
// загрузить lodash:
var _ = require('lodash');

// загрузка объектов всех уровней:
const usersCloned = _.cloneDeep(mapData.users);
const initialState = usersCloned;

export default function users(state = initialState, action) {
  switch ( action.type ) {
    case ADD_USER: {
      return [...state, action.payload];
    }
    
    case EDIT_USER: {
      const id = action.payload.id;
      const newUserData = action.payload;
      const newUsers = state.slice(0);

      console.log("edit user", id, newUserData);
      
      let user = newUsers.find(user => user.id === id);
      
      if (user !== undefined) {
        for ( let key in newUserData ) {
          if (key !== "id" && key !== "category") {
            user[key] = newUserData[key];
          }
        }
      }

      return newUsers;
    }
    case DELETE_USER: {
      const id = action.payload;
      const newUsers = state.slice(0);

      newUsers  = newUsers.filter(user => user.id !== id);
      return newUsers;

    }
    default: {
      return state;
    }
    
  }

}
