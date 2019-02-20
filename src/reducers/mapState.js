import { CHANGE_MAP_LEVEL } from '../res/constants';
import mapData from '../res/mapData.json';

// по умолчанию грузим 2 этаж (1 уровень):
const initialState = {
  mapLevel: 1,
  title: mapData.levels[1].title,
  blockSnapSize: mapData.levels[1].levelCellSize,
  mapWidth: mapData.levels[1].levelMapWidth,
  mapHeight: mapData.levels[1].levelMapHeight,
  mapBoundaries: mapData.levels[1].boundaries,
  mapCovering: mapData.levels[1].covering,
};

export default function mapState(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP_LEVEL: {
      const level = action.payload;
      
      return {
        mapLevel: level,
        title: mapData.levels[level].title,
        blockSnapSize: mapData.levels[level].levelCellSize,
        mapWidth: mapData.levels[level].levelMapWidth,
        mapHeight: mapData.levels[level].levelMapHeight,
        mapBoundaries: mapData.levels[level].boundaries,
        mapCovering: mapData.levels[level].covering,
      };
    }
    default: {
      return state;
    }
  }
}
