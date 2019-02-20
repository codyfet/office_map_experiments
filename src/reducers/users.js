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
      const id = action.payload.id;
      const newUserData = action.payload;
      const newUsers = state.slice(0);

      const user = newUsers.find(userObj => userObj.id === id);

      if (user !== undefined) {
        Object.keys(newUserData).forEach(key => {
          if (key !== 'id' && key !== 'category') {
            user[key] = newUserData[key];
          }
        });
      }

      return newUsers;
    }
    case DELETE_USER: {
      const id = action.payload;
      let newUsers = state.slice(0);

      newUsers = newUsers.filter(userObj => userObj.id !== id);
      return newUsers;
    }
    default: {
      return state;
    }
  }
}
