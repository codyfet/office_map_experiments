import { CHANGE_MAP_STATE } from '../res/constants';
import mapData from '../res/mapData.json';

// по умолчанию грузим 2 этаж (1 уровень):
const initialState = { 
    mapLevel: 1,
    blockSnapSize: mapData.levels[1].levelCellSize,
    mapWidth: mapData.levels[1].levelMapWidth,
    mapHeight: mapData.levels[1].levelMapHeight,
    mapBoundaries: mapData.levels[1].boundaries,
    mapCovering: mapData.levels[1].covering
}

export default function mapState(state = initialState, action) {
  if (action.type === CHANGE_MAP_STATE) {
    const level = action.payload;
    
    return {
        mapLevel: level,
        blockSnapSize: mapData.levels[level].levelCellSize,
        mapWidth: mapData.levels[level].levelMapWidth,
        mapHeight: mapData.levels[level].levelMapHeight,
        mapBoundaries: mapData.levels[level].boundaries,
        mapCovering: mapData.levels[level].covering
    };
  }
  return state;
}