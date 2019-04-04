import { 
  CREATE_PROJECT,
  UPDATE_PROJECTS_FROM_SERVER,
  PROJECTS_LOADING,
  FULFILLED 
} from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// загрузка проектов:
const initialState = {
  loading: false,
  data: _.cloneDeep(mapData.projects)
};

export default function workMode(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT: {
      return {
        loading: state.loading,
        data: [...state.data, action.payload]
      };
    }

    case `${UPDATE_PROJECTS_FROM_SERVER}_${FULFILLED}`: {
      return {
        loading: false,
        data: action.payload.data
      };
    }

    case PROJECTS_LOADING: {
      return {
        loading: true,
        data: state.data
      };
    }

    default: {
      return state;
    }
  }
}