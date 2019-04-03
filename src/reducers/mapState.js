import { 
  CHANGE_MAP_LEVEL,
  MAP_DESCRIPTION_LOADING,
  UPDATE_MAP_DESCRIPTION_FROM_SERVER
} from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

// по умолчанию грузим 2 этаж (1 уровень):
const mapCovering = _.cloneDeep(mapData.levels[1].covering);
const initialState = {
  mapLevel: 1,
  loading: false,
  title: mapData.levels[1].title,
  blockSnapSize: mapData.levels[1].levelCellSize,
  mapWidth: mapData.levels[1].levelMapWidth,
  mapHeight: mapData.levels[1].levelMapHeight,
  mapBoundaries: mapData.levels[1].boundaries,
  mapCovering
};

export default function mapState(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP_LEVEL: {
      const lvl = action.payload;
      const newMapCovering = _.cloneDeep(mapData.levels[lvl].covering);

      return {
        mapLevel: lvl,
        loading: state.loading,
        title: mapData.levels[lvl].title,
        blockSnapSize: mapData.levels[lvl].levelCellSize,
        mapWidth: mapData.levels[lvl].levelMapWidth,
        mapHeight: mapData.levels[lvl].levelMapHeight,
        mapBoundaries: mapData.levels[lvl].boundaries,
        mapCovering: newMapCovering
      };
    }

    case MAP_DESCRIPTION_LOADING: {
      return {
        ...state,
        loading: true
      };
    }

    case UPDATE_MAP_DESCRIPTION_FROM_SERVER: {
      const lvl = state.mapLevel;
      const newMapCovering = _.cloneDeep(mapData.levels[lvl].covering);

      return {
        mapLevel: lvl,
        loading: state.loading,
        title: mapData.levels[lvl].title,
        blockSnapSize: mapData.levels[lvl].levelCellSize,
        mapWidth: mapData.levels[lvl].levelMapWidth,
        mapHeight: mapData.levels[lvl].levelMapHeight,
        mapBoundaries: mapData.levels[lvl].boundaries,
        mapCovering: newMapCovering
      };
    }


    default: {
      return state;
    }
  }
}
