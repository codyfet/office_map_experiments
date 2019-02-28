import { ADD_USER, EDIT_USER, DELETE_USER } from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// загрузка объектов всех уровней:
const usersCloned = _.cloneDeep(mapData.users);
const initialState = usersCloned;

export default function users(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      return [action.payload, ...state];
    }

    case EDIT_USER: {
      const newUserData = action.payload;
    
      const newUsers = state.map((user) => {
        if (user.id === newUserData.id) {
          Object.keys(newUserData).forEach((key) => {
            if (key !== 'id' && key !== 'category') {
              user[key] = newUserData[key];
            }
          });
        }
        return user; 
      }); 

      return newUsers;
    }
    case DELETE_USER: {
      const id = action.payload;
      return state.filter(userObj => userObj.id !== id);
    }
    
    default: {
      return state;
    }
  }
}
