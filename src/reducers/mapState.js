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

// id": "second_floor",
// "sortId": 1,
// "title": "Второй этаж",
// "levelMapWidth": 3650,
// "levelMapHeight": 1670,
// "levelCellSize": 5,
// "boundaries": "0,0 0,1550 540,1550 540,1670 830,1670 830,1550 1100,1550 1100,1200 830,1200 830,820 1900,820 1900,1140 2180,1140 2180,820 3650,820 3650,0",
// "covering": [
//   "0 1550 540 1670",
//   "830 820 1100 1200",
//   "830 1550 1100 1670",
//   "1100 820 1900 1670",
//   "1900 1140 2180 1670",
//   "2180 820 3650 1670"
// ]

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
