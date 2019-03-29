import { LEFT_SIDE } from '../res/constantsOrientation';
import makePolygonFromObjects from './makePolygonFromObjects';
import { 
  computeShiftToZeroPointByFirstPointOfPolygon, 
  shiftPoint 
} from './polygonMagic';

const _ = require('lodash');

// ОГРАНИЧЕНИЯ:
// Если объекты образуют кольцо, то центр этого кольца удалится

// EDGES ORIENTATION:
const HORIZONTAL = 'HORIZONTAL';
const VERTICAL = 'VERTICAL';
const ERROR = 'ERROR';

// DIRECTIONS:
const RIGHT = 'RIGHT';
const UP = 'UP';
const LEFT = 'LEFT';
const DOWN = 'DOWN';

function computeDistanceBetweenPoints(point1, point2) {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

export default function mergeObjects(objects, step = 5, finalCategory = 'service_room') {
  let polygon = makePolygonFromObjects(objects, step);
  
  let finish = 'полигон сделан!';

  // по умолчанию наследуем все параметры первого выделенного объекта:
  let newObject = { 
    category: finalCategory,
    id: objects[0].id,
    coordinates: polygon[0],
    isCompound: true,
    polygonPoints: polygon,
    // для композиции, мы должны написать координаты относительно первой точки полигона,
    // т.е. сделать сдвиг всех точек объектов по свдигу первой точки полинона от начала координат:
    composition: objects.map((object) => ({
      x: object.coordinates.x,
      y: object.coordinates.y,
      width: object.width,
      height: object.height
    })),
    color: objects[0].color,
    iconPosition: { x: 0, y: 0 },
    movable: false, // а вот двигать его будет уже нельзя
    hasIntersection: false, // предыдущие объекты не имели пересечений с другими
  };
  
  // объединяем:
  if (finalCategory === 'table') {
    newObject.userId = '';
    newObject.seatLocation = LEFT_SIDE;
  } else if (['cupboard', 'printer', 'scaner', 'shredder'].includes(finalCategory)) {
    newObject.orientation = LEFT_SIDE;
    newObject.title = '';
  } else { // остаются статичные объекты:
    newObject.doorLocation = LEFT_SIDE;
    newObject.doorPosition = {
      x: 0,
      y: computeDistanceBetweenPoints(polygon[0], polygon[1]) / 2,
    };
    newObject.title = '';
  }
  
  return newObject;
} 