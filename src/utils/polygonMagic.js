// DIRECTIONS:
const RIGHT = 'RIGHT';
const UP = 'UP';
const LEFT = 'LEFT';
const DOWN = 'DOWN';
const ERROR = 'ERROR';

function computeShiftToZeroPointByFirstPointOfPolygon(polygonPoints) {
  return {
    x: -polygonPoints[0].x,
    y: -polygonPoints[0].y
  };
}

function shiftPoint(point, shift) {
  return {
    x: point.x + shift.x,
    y: point.y + shift.y
  };
}

function shiftPolygonToPointZero(polygonPoints) {
  // сначала определяем смещение по координатам:
  let shift = {
    x: -polygonPoints[0].x,
    y: -polygonPoints[0].y
  };
  return polygonPoints.map((point) => ({
    x: point.x + shift.x,
    y: point.y + shift.y
  }));
}

function shiftPolygonTo(polygonPoints, shift = { x: 0, y: 0 }) {
  return polygonPoints.map((point) => ({
    x: point.x + shift.x,
    y: point.y + shift.y
  }));
}

function computePolygonCenter(polygonPoints) {
  return {
    x: polygonPoints.reduce((prevVal, currVal) => ({ x: prevVal.x + currVal.x })).x / polygonPoints.length,
    y: polygonPoints.reduce((prevVal, currVal) => ({ y: prevVal.y + currVal.y })).y / polygonPoints.length
  };
}

function detectDirection(point, pointNext) {
  if (point.x === pointNext.x) {
    if (point.y < pointNext.y) {
      return DOWN;
    }
    if (point.y > pointNext.y) {
      return UP;
    }
  }
  if (point.y === pointNext.y) {
    if (point.x < pointNext.x) {
      return RIGHT;
    }
    if (point.x > pointNext.x) {
      return LEFT;
    }
  } 
  return ERROR;
}

function shrinkPolygonPoints(polygonPoints, padding) {
  let firstShrunkPoint = {
    x: polygonPoints[0].x + padding,
    y: polygonPoints[0].y + padding
  };
  let newPolygonPoints = [firstShrunkPoint];
  // порпобуем обходить нашу фигуру по трем точкам:
  for (let i = 1; i < polygonPoints.length - 1; i += 1) {
    // будем определять направление ребер между точками
    // ведь мы знаем, как строится наша фигура - слева от ребра внутренности, поэтому
    let direction0 = detectDirection(polygonPoints[i - 1], polygonPoints[i]);
    let direction1 = detectDirection(polygonPoints[i], polygonPoints[i + 1]);

    // если ребра между точкой i направлены ВПРАВО и ВНИЗ => смещение точки (ВПРАВО, ВВЕРХ)
    if ([RIGHT, DOWN].includes(direction0) && [RIGHT, DOWN].includes(direction1)) {
      newPolygonPoints.push({
        x: polygonPoints[i].x + padding,
        y: polygonPoints[i].y - padding
      });
    }
    // если ребра между точкой i направлены ВПРАВО и ВВЕРХ => смещение точки (ВЛЕВО, ВВЕРХ)
    if ([RIGHT, UP].includes(direction0) && [RIGHT, UP].includes(direction1)) {
      newPolygonPoints.push({
        x: polygonPoints[i].x - padding,
        y: polygonPoints[i].y - padding
      });
    }
    // если ребра между точкой i направлены ВЛЕВО и ВВЕРХ => смещение точки (ВЛЕВО, ВВЕРХ)
    if ([LEFT, UP].includes(direction0) && [LEFT, UP].includes(direction1)) {
      newPolygonPoints.push({
        x: polygonPoints[i].x - padding,
        y: polygonPoints[i].y + padding
      });
    }
    // если ребра между точкой i направлены ВЛЕВО и ВНИЗ => смещение точки (ВПРАВО, ВНИЗ)
    if ([LEFT, DOWN].includes(direction0) && [LEFT, DOWN].includes(direction1)) {
      newPolygonPoints.push({
        x: polygonPoints[i].x + padding,
        y: polygonPoints[i].y + padding
      });
    }
  }
  return newPolygonPoints;
}

export {
  computeShiftToZeroPointByFirstPointOfPolygon,
  shiftPoint,
  shiftPolygonToPointZero,
  shrinkPolygonPoints
};