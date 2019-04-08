import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { PEdge } from './EdgeClasses/PEdge';

// ОГРАНИЧЕНИЯ:
// Если объекты образуют кольцо, то центр этого кольца удалится

// DIRECTIONS:
const RIGHT = 'RIGHT';
const UP = 'UP';
const LEFT = 'LEFT';
const DOWN = 'DOWN';

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

function edgesContainPoint(point, edges) {
  return edges.some((edge) => edge.containsPoint(point));
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
      let tempPoint = points.find((p) => isEqual(p, { x, y }));
      if (tempPoint !== undefined) {
        return {
          point: cloneDeep(tempPoint),
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
  if (!edgesContainPoint(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let y = startPoint.y + step; y <= borders.y; y += step) {
    let foundPoint = points.find((p) => isEqual(p, { x: startPoint.x, y }));
    if (foundPoint !== undefined) {
      return {
        point: cloneDeep(foundPoint),
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
  if (!edgesContainPoint(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let x = startPoint.x + step; x <= borders.x; x += step) {
    let foundPoint = points.find((p) => isEqual(p, { x, y: startPoint.y }));
    if (foundPoint !== undefined) {
      return {
        point: cloneDeep(foundPoint),
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
  if (!edgesContainPoint(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let y = startPoint.y - step; y >= borders.y; y -= step) {
    let foundPoint = points.find((p) => isEqual(p, { x: startPoint.x, y }));
    if (foundPoint !== undefined) {
      return {
        point: cloneDeep(foundPoint),
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
  if (!edgesContainPoint(checkPoint, objectsEdges)) {
    return undefined;
  }

  for (let x = startPoint.x - step; x >= borders.x; x -= step) {
    let foundPoint = points.find((p) => isEqual(p, { x, y: startPoint.y }));
    if (foundPoint !== undefined) {
      return {
        point: cloneDeep(foundPoint),
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
      clearedUpPoints.push(cloneDeep(points[0]));
    }

    if (isPointNotRedundant(i, points)) {
      clearedUpPoints.push(cloneDeep(points[i]));
    }

    if (i === points.length - 2) {
      clearedUpPoints.push(cloneDeep(points[points.length - 1]));
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
        sortedPoints.push(cloneDeep(foundPoint.point));
        break;
      }
    } // мы точно знаем, что в одном из направлений найдётся точка, т.к. объекты соприкасаются ребрами!
  } while (!isEqual(currentPoint.point, startPoint.point));

  return getRidOfRedundantPoints(sortedPoints);
}

export default function makePolygonFromObjects(objects, step = 5) {
  // сначала определим размер области, в которой лежат наши объекты:
  const { topLeftCorner, bottomRightCorner } = computeAreaSizes(objects);

  // взять из массива объекты
  // преобразовать их в массивы точек
  let objectsPoints = objects.map((object) => convertJSONObjectToPoints(object));
  // взять массив всех ребер:
  let objectsEdges = objectsPoints.map((points) => PEdge.getEdgesFromPoints(points)).flat();
  // взять массив всех точек:
  let points = objectsPoints.flat();
  // создать последовательность точек нового объекта из имеющихся:
  let polygon = constructFigureFromAllPoints(points, step, objectsEdges, topLeftCorner, bottomRightCorner);

  return polygon;
}