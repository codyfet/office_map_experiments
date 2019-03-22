import { LEFT_SIDE } from '../res/constantsTableSeat';
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

function convert2dPointsToString(points) {
  let stringCoordinates = [];
  for (let i = 0; i < points.length; i += 1) {
    stringCoordinates.push(points[i].x);
    stringCoordinates.push(points[i].y);
  }
  return stringCoordinates.join(' ');
} 

function convertJSONObjectToPoints(jsonObject) {
  // "coordinates": { "x": 535, "y": 1170 },
  // "width": 5,
  // "height": 120,
  let points = [];
  let start = jsonObject.coordinates;
  // строим объект против часовой стрелки:
  points.push(start);
  points.push({
    x: start.x,
    y: start.y + jsonObject.height
  });
  points.push({
    x: start.x + jsonObject.width,
    y: start.y + jsonObject.height
  });
  points.push({
    x: start.x + jsonObject.width,
    y: start.y
  });
  return points;
}

function getEdgesFromPoints(points) {
  let edges = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    edges.push({
      start: points[i],
      end: points[i + 1]
    });
  }
  // добавим замыкающую точку:
  edges.push({
    start: points[points.length - 1],
    end: points[0]
  });
  return edges;
}

function isEdgeHorizontal(edge) {
  return edge.start.y === edge.end.y;
}

function isEdgeVertical(edge) {
  return edge.start.x === edge.end.x;
} 

function isPointAndEdgeOnTheSameLine(point, edge) {
  return (
    edge.start.x === point.x && edge.end.x === point.x
    || edge.start.y === point.y && edge.end.y === point.y
  );
}

function isPointOnEdge(point, edge) {
  if (isPointAndEdgeOnTheSameLine(point, edge) && isEdgeHorizontal(edge)) {
    if (edge.start.x <= point.x && point.x <= edge.end.x
        || edge.start.x >= point.x && point.x >= edge.end.x) {
      return true;
    } else return false; 
  }
  if (isPointAndEdgeOnTheSameLine(point, edge) && isEdgeVertical(edge)) {
    if (edge.start.y <= point.y && point.y <= edge.end.y
        || edge.start.y >= point.y && point.y >= edge.end.y) {
      return true;
    } else return false; 
  }
  return false;
}

function isPointOnSomeEdges(point, edges) {
  return edges.some((edge) => isPointOnEdge(point, edge));
}

function computeDistanceBetweenPoints(point1, point2) {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function findEdgeByPoint(point, edges) {
  return edges.find((edge) => _.isEqual(edge.start, point) || _.isEqual(edge.end, point));
}

function deleteByValue(array, elem) {
  return array.filter((e) => !_.isEqual(e, elem));
}

function isEdge1InsideEdge2(edge1, edge2, orientation) {
  if (orientation === 'horizontal') {
    if (edge2.start.x <= edge1.start.x && edge1.end.x <= edge2.end.x
        || edge2.start.x <= edge1.end.x && edge1.start.x <= edge2.end.x) {
      return true;
    } else return false; 
  }
  if (orientation === 'vertical') {
    if (edge2.start.y <= edge1.start.y && edge1.end.y <= edge2.end.y
        || edge2.start.y <= edge1.end.y && edge1.start.y <= edge2.end.y) {
      return true;
    } else return false; 
  }
  return false;
}

function computeAreaSizes(objects) {
  let topLeftCorner = {
    x: 100000,
    y: 100000
  };
  let bottomRightCorner = {
    x: 0,
    y: 0
  };
  objects.forEach((object) => {
    const { x, y } = object.coordinates;
    const { width, height } = object;
    topLeftCorner.x = x < topLeftCorner.x ? x : topLeftCorner.x;
    topLeftCorner.y = y < topLeftCorner.y ? y : topLeftCorner.y;
    bottomRightCorner.x = x + width > bottomRightCorner.x ? x + width : bottomRightCorner.x;
    bottomRightCorner.y = y + height > bottomRightCorner.y ? y + height : bottomRightCorner.y;
  });
  return {
    topLeftCorner, 
    bottomRightCorner
  };
}

function findStartPoint(start, step, borders, points) {
  for (let x = start.x; x < borders.x; x += step) {
    for (let y = start.y; y < borders.y; y += step) {
      let tempPoint = points.find((p) => _.isEqual(p, { x, y }));
      if (tempPoint !== undefined) {
        return {
          point: _.cloneDeep(tempPoint),
          direction: DOWN
        };
      }
    }
  }
  return undefined;
}

function chooseNewDirections(curretnDirection) {
  switch (curretnDirection) {
    case DOWN:
      return [LEFT, DOWN, RIGHT];
    case RIGHT:
      return [DOWN, RIGHT, UP];
    case UP:
      return [RIGHT, UP, LEFT];
    case LEFT:
      return [UP, LEFT, DOWN];
    default:
      return [];
  }
}

// заменить поиск с помощью ребер:
// искать внизу:
function searchPointDOWNwithEdges(startPoint, points, step, borders, objectsEdges) {
  // доп. проверка:
  let checkPoint = {
    x: startPoint.x,
    y: startPoint.y + step  
  };
  if (!isPointOnSomeEdges(checkPoint, objectsEdges)) {
    return undefined;
  }
  
  for (let y = startPoint.y + step; y <= borders.y; y += step) {
    let foundPoint = points.find((p) => _.isEqual(p, { x: startPoint.x, y }));
    if (foundPoint !== undefined) {
      return {
        point: _.cloneDeep(foundPoint),
        direction: DOWN
      };
    }
  }
  return undefined;
}

// искать справа:
function searchPointRIGHTwithEdges(startPoint, points, step, borders, objectsEdges) {
  // доп. проверка:
  let checkPoint = {
    x: startPoint.x + step,
    y: startPoint.y  
  };
  if (!isPointOnSomeEdges(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let x = startPoint.x + step; x <= borders.x; x += step) {
    let foundPoint = points.find((p) => _.isEqual(p, { x, y: startPoint.y }));
    if (foundPoint !== undefined) {
      return {
        point: _.cloneDeep(foundPoint),
        direction: RIGHT
      };
    }
  }
  return undefined;
}

// искать сверху:
function searchPointUPwithEdges(startPoint, points, step, borders, objectsEdges) {
  // доп. проверка:
  let checkPoint = {
    x: startPoint.x,
    y: startPoint.y - step  
  };
  if (!isPointOnSomeEdges(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let y = startPoint.y - step; y >= borders.y; y -= step) {
    let foundPoint = points.find((p) => _.isEqual(p, { x: startPoint.x, y }));
    if (foundPoint !== undefined) {
      return {
        point: _.cloneDeep(foundPoint),
        direction: UP
      };
    }
  }
  return undefined;
}

// искать слева:
function searchPointLEFTwithEdges(startPoint, points, step, borders, objectsEdges) {
  // доп. проверка:
  let checkPoint = {
    x: startPoint.x - step,
    y: startPoint.y  
  };
  if (!isPointOnSomeEdges(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let x = startPoint.x - step; x >= borders.x; x -= step) {
    let foundPoint = points.find((p) => _.isEqual(p, { x, y: startPoint.y }));
    if (foundPoint !== undefined) {
      return {
        point: _.cloneDeep(foundPoint),
        direction: LEFT
      };
    }
  }
  return undefined;
}

function searchPointInDirection(currentPoint, points, step, objectsEdges, topLeftCorner, bottomRightCorner) {
  switch (currentPoint.direction) {
    case DOWN:
      return searchPointDOWNwithEdges(currentPoint.point, points, step, bottomRightCorner, objectsEdges);
    case RIGHT:
      return searchPointRIGHTwithEdges(currentPoint.point, points, step, bottomRightCorner, objectsEdges);
    case UP:
      return searchPointUPwithEdges(currentPoint.point, points, step, topLeftCorner, objectsEdges);
    case LEFT:
      return searchPointLEFTwithEdges(currentPoint.point, points, step, topLeftCorner, objectsEdges);
    default:
      return undefined;
  }
}

// рассматривает соседние точки у данной, заданной по pointIndex:
function isPointNotRedundant(pointIndex, points) {
  // так как три точки в нашем случае образуют только угол =>
  // у каждой точки - соседние точки имеют различные координаты, как по x, так и по y:
  // но, если у соседних точек совпадают координаты по x или по y =>
  // точка между ними - лишняя, она лежит на отрезке, образованном соседними точками
  // ЗАМЕЧАНИЕ:
  // По условиям отрисовки - угловая точка не может быть лишней 
  return (
    points[pointIndex - 1].x !== points[pointIndex + 1].x 
    && points[pointIndex - 1].y !== points[pointIndex + 1].y
  );
}

function getRidOfRedundantPoints(points) {
  let clearedUpPoints = [];
  for (let i = 1; i < points.length - 1; i += 1) {
    if (i === 1) {
      clearedUpPoints.push(_.cloneDeep(points[0]));
    }

    if (isPointNotRedundant(i, points)) {
      clearedUpPoints.push(_.cloneDeep(points[i]));
    }

    if (i === points.length - 2) {
      clearedUpPoints.push(_.cloneDeep(points[points.length - 1]));
    }
  }
  return clearedUpPoints;
}

function constructFigureFromAllPoints(points, step, objectsEdges, topLeftCorner, bottomRightCorner) {
  let startPoint = findStartPoint(topLeftCorner, step, bottomRightCorner, points);
  // теперь идем от стартовой точки, объединяя все соседние:
  // в зависимости от направления вектора
  let sortedPoints = [startPoint.point];
  let currentPoint = startPoint;
  do {
    let directions = chooseNewDirections(currentPoint.direction);
    for (let i = 0; i < directions.length; i += 1) {
      // изменили направление:
      currentPoint.direction = directions[i];
      // ищем точку в данном направлении:
      let foundPoint = searchPointInDirection(currentPoint, points, step, objectsEdges, topLeftCorner, bottomRightCorner);
      if (foundPoint !== undefined) {
        currentPoint = foundPoint;
        sortedPoints.push(_.cloneDeep(foundPoint.point));
        break;
      }
    } // мы точно знаем, что в одном из направлений найдётся точка, т.к. объекты соприкасаются ребрами!
  } while (!_.isEqual(currentPoint.point, startPoint.point));

  return getRidOfRedundantPoints(sortedPoints);
}

export default function makePolygonFromObjects(objects, step = 5) {
  // сначала определим размер области, в которой лежат наши объекты:
  const { topLeftCorner, bottomRightCorner } = computeAreaSizes(objects);
  
  // взять из массива объекты
  // преобразовать их в массивы точек
  let objectsPoints = objects.map((object) => convertJSONObjectToPoints(object));
  // взять массив всех ребер:
  let objectsEdges = objectsPoints.map((points) => getEdgesFromPoints(points)).flat();
  // взять массив всех точек:
  let points = objectsPoints.flat();
  // создать последовательность точек нового объекта из имеющихся:
  let polygon = constructFigureFromAllPoints(points, step, objectsEdges, topLeftCorner, bottomRightCorner);
  // let polygon = convert2dPointsToString(polygonPoints);
  
  return polygon;
}