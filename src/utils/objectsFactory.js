import {
  TABLE_COLOR,
  CUPBOARD_COLOR,
  PRINTER_COLOR,
  SCANER_COLOR,
  SHREDDER_COLOR,
  PUBLIC_PLACE_COLOR,
  MEETING_ROOM_COLOR,
  SERVICE_ROOM_COLOR,
  CONSTRUCTION_COLOR,
} from '../res/constantsObjectsColors';
import {
  LEFT_SIDE
} from '../res/constantsTableSeat';

const TABLE = 'table';
const CUPBOARD = 'cupboard';
const PRINTER = 'printer';
const SCANNER = 'scaner';
const SHREDDER = 'shredder';
const PUBLIC_PLACE = 'public_place';
const MEETING_ROOM = 'meeting_room';
const SERVICE_ROOM = 'service_room';
const CONSTRUCTION = 'construction';

const movableObjectTypes = [TABLE, CUPBOARD, PRINTER, SCANNER, SHREDDER];
const staticObjectTypes = [PUBLIC_PLACE, MEETING_ROOM, SERVICE_ROOM, CONSTRUCTION];

function isMovableType(object) {
  return movableObjectTypes.includes(object.category);
}

function isStaticType(object) {
  return staticObjectTypes.includes(object.category);
}

function createMapObject(type, id, coords, userId) {
  const newObject = {
    category: type,
    id: id,
    coordinates: coords,
    movable: true,
    hasIntersection: true,
    color: TABLE_COLOR,
  };

  switch (type) {
    case TABLE:
      newObject.width = 40;
      newObject.height = 70;
      newObject.userId = userId;
      newObject.color = TABLE_COLOR;
      newObject.seatLocation = LEFT_SIDE;
      break;
    case CUPBOARD:
      newObject.width = 30;
      newObject.height = 50;
      newObject.color = CUPBOARD_COLOR;
      newObject.orientation = LEFT_SIDE;
      break;
    case PRINTER:
      newObject.width = 40;
      newObject.height = 40;
      newObject.color = PRINTER_COLOR;
      newObject.orientation = LEFT_SIDE;
      break;

    case SCANNER:
      newObject.width = 40;
      newObject.height = 40;
      newObject.color = SCANER_COLOR;
      newObject.orientation = LEFT_SIDE;
      break;

    case SHREDDER:
      newObject.width = 40;
      newObject.height = 30;
      newObject.color = SHREDDER_COLOR;
      newObject.orientation = LEFT_SIDE;
      break;

    case PUBLIC_PLACE:
      newObject.width = 100;
      newObject.height = 100;
      newObject.color = PUBLIC_PLACE_COLOR;
      newObject.doorLocation = LEFT_SIDE;
      newObject.doorPosition = {
        x: 0,
        y: newObject.height / 2,
      };
      break;

    case MEETING_ROOM:
      newObject.width = 100;
      newObject.height = 100;
      newObject.color = MEETING_ROOM_COLOR;
      newObject.doorLocation = LEFT_SIDE;
      newObject.doorPosition = {
        x: 0,
        y: newObject.height / 2,
      };
      break;

    case SERVICE_ROOM:
      newObject.width = 50;
      newObject.height = 50;
      newObject.color = SERVICE_ROOM_COLOR;
      newObject.doorLocation = LEFT_SIDE;
      newObject.doorPosition = {
        x: 0,
        y: newObject.height / 2,
      };
      break;

    case CONSTRUCTION:
      newObject.width = 45;
      newObject.height = 45;
      newObject.color = CONSTRUCTION_COLOR;
      break;

    default:
      break;
  }

  return newObject;
}

export {
  isMovableType,
  isStaticType,
  createMapObject
};