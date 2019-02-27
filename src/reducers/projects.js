import { CREATE_PROJECT } from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// загрузка проектов:
const initialState = _.cloneDeep(mapData.projects);

export default function workMode(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT: {
      return [...state, action.payload];
    }
    default: {
      return state;
    }
  }
}