import {
  CREATE_OBJECT,
  MOVE_OBJECT,
  TURN_OBJECT,
  DELETE_OBJECT,
  UPDATE_USER,
  CHANGE_OBJECTS_LEVEL,
  SET_HAS_INTERSECTION,
  CHANGE_ANY_OBJECT_DATA,
  SHIFT_OBJECTS,
} from '../res/constants';
import mapData from '../res/mapData.json';
// загрузить lodash:
const _ = require('lodash');

function shiftObjectCoords(object, shift) {
  let newObject = _.cloneDeep(object);
  newObject.x += shift.x;
  newObject.y += shift.y;
  return newObject;
}

function setupInitalState() {
  // загрузка объектов всех уровней:
  const mapDataCloned = _.cloneDeep(mapData);
  const allLevelsObjects = mapDataCloned.levels.map(elem => elem.objects);

  return {
    mapLevel: 1, // по умолчанию мы загружаем 1 уровень
    levels: allLevelsObjects,
  };
}


const initialState = setupInitalState();

export default function objects(state = initialState, action) {
  switch (action.type) {
    case CREATE_OBJECT: {
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      newLevels[lvl] = [...state.levels[lvl], action.payload];
      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case DELETE_OBJECT: {
      const lvl = state.mapLevel;
      const newLevels = state.levels.slice(0);
      const objectId = action.payload;

      newLevels[lvl] = newLevels[lvl].filter(val => val.id !== objectId);
      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case MOVE_OBJECT: {
      const lvl = state.mapLevel;
      const objectId = action.payload.id;
      const newPosition = action.payload.pos;
      
      const newLevels = state.levels.slice(0);
      const movedObject = newLevels[lvl].find(val => val.id === objectId);
      if (movedObject !== undefined) {
        if (movedObject.isCompound) {
          const shift = {
            x: newPosition.x - movedObject.coordinates.x,
            y: newPosition.y - movedObject.coordinates.y,
          };
          movedObject.polygonPoints = movedObject.polygonPoints.map((point) => shiftObjectCoords(point, shift));
          movedObject.composition = movedObject.composition.map((compObject) => shiftObjectCoords(compObject, shift));
        }
        movedObject.coordinates = newPosition;
      }

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case SET_HAS_INTERSECTION: {
      const lvl = state.mapLevel;
      const objectId = action.payload.id;
      const hasIntersection = action.payload.hasIntersection;
      
      const newLevels = state.levels.slice(0);
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        object.hasIntersection = hasIntersection;
      }

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case TURN_OBJECT: {
      const lvl = state.mapLevel;
      const objectId = action.payload;
      
      const newLevels = state.levels.slice(0);
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        // поворот самого объекта:
        const tempW = object.width;
        object.width = object.height;
        object.height = tempW;
        if (object.category === 'table') {
          // порочаиваем место против часовой стрелки:
          // такой трюк работает, так как мы используем константы:
          // LEFT(0) BOTTOM(1) RIGHT(2) TOP(3)
          object.seatLocation = (object.seatLocation + 1) % 4;
        }
        if (['cupboard', 'printer', 'scaner', 'shredder'].includes(object.category)) {
          // порочаиваем место против часовой стрелки:
          // такой трюк работает, так как мы используем константы:
          // LEFT(0) BOTTOM(1) RIGHT(2) TOP(3)
          object.orientation = (object.orientation + 1) % 4;
        }
      }

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case CHANGE_OBJECTS_LEVEL: {
      return {
        mapLevel: action.payload,
        levels: state.levels,
      };
    }
    case UPDATE_USER: {
      const lvl = state.mapLevel;
      const objectId = action.payload.id;
      const newUserId = action.payload.userId;
      
      const newLevels = state.levels.slice(0);
      const object = newLevels[lvl].find(val => val.id === objectId);
      if (object !== undefined) {
        object.userId = newUserId;
      }

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case CHANGE_ANY_OBJECT_DATA: {
      const lvl = state.mapLevel;
      const objectData = action.payload;
      
      const newLevels = state.levels.slice(0);   
      const object = newLevels[lvl].find(val => val.id === objectData.id);
      if (object !== undefined) {
        Object.keys(objectData).forEach(key => {
          object[key] = objectData[key];
        });
      }

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    case SHIFT_OBJECTS: {
      const lvl = state.mapLevel;
      const shift = action.payload.shift;
      const objectIds = action.payload.ids.split(' ');
     
      const newLevels = state.levels.slice(0);
      newLevels[lvl].forEach((object) => {
        if (objectIds.includes(object.id) && object.movable) {
          if (object.isCompound) {
            object.polygonPoints = object.polygonPoints.map((point) => shiftObjectCoords(point, shift));
            object.composition = object.composition.map((compObject) => shiftObjectCoords(compObject, shift));
          }
          object.coordinates = shiftObjectCoords(object.coordinates, shift);
        }
      });

      return {
        mapLevel: lvl,
        levels: newLevels,
      };
    }
    default: {
      return state;
    }
  }
}
