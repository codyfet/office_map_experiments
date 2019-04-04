import { 
  CHANGE_MAP_LEVEL,
  MAP_DESCRIPTION_LOADING,
  UPDATE_MAP_DESCRIPTION_FROM_SERVER,
  FULFILLED
} from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// по умолчанию грузим 2 этаж (1 уровень):
const mapDescription = mapData.levels.map((level) => {
  delete level.objects;
  return level;
});

// по умолчанию грузим 2 этаж (1 уровень):
const initialState = {
  level: 1,
  loading: false,
  description: mapDescription
};

export default function mapState(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP_LEVEL: {
      const lvl = action.payload;

      return {
        level: lvl,
        loading: state.loading,
        description: state.description
      };
    }

    case MAP_DESCRIPTION_LOADING: {
      return {
        ...state,
        loading: true
      };
    }

    case `${UPDATE_MAP_DESCRIPTION_FROM_SERVER}_${FULFILLED}`: {
      const lvl = state.level;

      return {
        level: lvl,
        loading: false,
        description: action.payload.data
      };
    }


    default: {
      return state;
    }
  }
}
