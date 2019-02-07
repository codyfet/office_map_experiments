import {
  CREATE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT,
  DELETE_OBJECT,
  UPDATE_USER,
  CHANGE_OBJECTS_LEVEL,
  CHANGE_CORRECT_LOCATION,
  CHANGE_ANY_OBJECT_DATA
} from "../res/constants";
import mapData from "../res/mapData.json";

// загрузка объектов всех уровней:
const allLevelsObjects = mapData.levels.map( (elem) => (elem.objects) ); 

const initialState = {
  mapLevel: 1, //по умолчанию мы загружаем 1 уровень
  levels: allLevelsObjects
};

//Изменим:
export default function objects(state = initialState, action) {
  switch (action.type) {
    case CREATE_OBJECT: {
      
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      newLevels[lvl] = [...state.levels[lvl], action.payload];
      return {
        mapLevel: lvl,
        levels: newLevels
      };

    }      
    case DELETE_OBJECT: {
      
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      const objectId = action.payload;

      newLevels[lvl] = newLevels[lvl].filter(val => val.id !== objectId);
      return {
        mapLevel: lvl,
        levels: newLevels
      };

    }
    case MOVE_OBJECT: {
      
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      
      const objectId = action.payload.id;
      const newPosition = action.payload.pos;

      const movedObject = newLevels[lvl].find(val => val.id === objectId);
      if (movedObject !== undefined) {
        movedObject.coordinates = newPosition;
      }

      return {
        mapLevel: lvl,
        levels: newLevels
      };
    }
    case CHANGE_CORRECT_LOCATION: {
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      
      const objectId = action.payload.id;
      const corrLoc = action.payload.corrLoc;
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        object.correctLocation = corrLoc;
      }

      return {
        mapLevel: lvl,
        levels: newLevels
      };
    }
    case TURN_OBJECT: {
      
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      
      const objectId = action.payload;
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        let tempW = object.width;
        object.width = object.height;
        object.height = tempW;
      }

      return {
        mapLevel: lvl,
        levels: newLevels
      };

    }
    case CHANGE_OBJECTS_LEVEL: {
      return {
        mapLevel: action.payload,
        levels: state.levels
      };

    }
    case UPDATE_USER: {

      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      
      const objectId = action.payload.id;
      const newUserId = action.payload.userId;
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        object.userId = newUserId;
      }

      return {
        mapLevel: lvl,
        levels: newLevels
      };

    }
    case CHANGE_ANY_OBJECT_DATA: {
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      
      const objectData = action.payload;
      const object = newLevels[lvl].find(val => val.id === objectData.id);
      if (object !== undefined) {
        for ( let key in objectData ) {
          object[key] = objectData[key];
        }
      }

      return {
        mapLevel: lvl,
        levels: newLevels
      };
    }
    default: {
      return state;
    }
    
  }
}
