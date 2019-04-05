import { 
  ADD_USER, 
  EDIT_USER, 
  DELETE_USER,
  USERS_LOADING,
  UPDATE_USERS_FROM_SERVER
} from '../res/constants';
import {
  FULFILLED,
  REJECTED,
  PENDING
} from '../res/constantsForLoadingStatus';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// загрузка объектов всех уровней:
const usersCloned = _.cloneDeep(mapData.users);
const initialState = {
  loading: FULFILLED,
  data: usersCloned
};
export default function users(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      return {
        loading: state.loading,
        data: [action.payload, ...state.data]
      };
    }

    case EDIT_USER: {
      const newUserData = action.payload;
    
      const newUsers = state.data.map((user) => {
        if (user.id === newUserData.id) {
          Object.keys(newUserData).forEach((key) => {
            if (key !== 'id' && key !== 'category') {
              user[key] = newUserData[key];
            }
          });
        }
        return user; 
      });

      return {
        loading: state.loading,
        data: newUsers
      };
    }
    case DELETE_USER: {
      const id = action.payload;
      return {
        loading: state.loading,
        data: state.data.filter(userObj => userObj.id !== id)
      };
    }

    case `${UPDATE_USERS_FROM_SERVER}_${FULFILLED}`: {
      return {
        loading: FULFILLED,
        data: action.payload.data
      };
    }

    case `${UPDATE_USERS_FROM_SERVER}_${REJECTED}`: {
      return {
        loading: REJECTED,
        data: state.data
      };
    }

    case USERS_LOADING: {
      return {
        loading: PENDING,
        data: state.data
      };
    }

    
    default: {
      return state;
    }
  }
}
