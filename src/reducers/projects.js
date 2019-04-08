import cloneDeep from 'lodash/cloneDeep';
import {
  CREATE_PROJECT,
  UPDATE_PROJECTS_FROM_SERVER,
  PROJECTS_LOADING
} from '../res/constants';
import {
  FULFILLED,
  REJECTED,
  PENDING
} from '../res/constantsForLoadingStatus';
import mapData from '../res/mapData.json';

// загрузка проектов:
const initialState = {
  loading: FULFILLED,
  data: cloneDeep(mapData.projects)
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
        loading: FULFILLED,
        data: action.payload.data
      };
    }

    case `${UPDATE_PROJECTS_FROM_SERVER}_${REJECTED}`: {
      return {
        loading: REJECTED,
        data: state.data
      };
    }

    case PROJECTS_LOADING: {
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