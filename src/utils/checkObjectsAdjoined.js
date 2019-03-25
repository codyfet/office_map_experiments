const _ = require('lodash');

// EDGES ORIENTATION:
const HORIZONTAL = 'HORIZONTAL';
const VERTICAL = 'VERTICAL';
const ERROR = 'ERROR';

// DIRECTIONS:
const RIGHT = 0;
const UP = 1;
const LEFT = 2;
const DOWN = 3;

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

function isEdgesOnTheSameLevel(edge1, edge2) {
  if (isEdgeHorizontal(edge1) && isEdgeHorizontal(edge2)) {
    return {
      isSameLevel: edge1.start.y === edge2.start.y,
      orientation: HORIZONTAL
    };
  }
  if (isEdgeVertical(edge1) && isEdgeVertical(edge2)) {
    return {
      isSameLevel: edge1.start.x === edge2.start.x,
      orientation: VERTICAL
    };
  } 
  return {
    isSameLevel: false,
    orientation: ERROR
  };
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

function isEdgePointsInsideAnotherEdge(edge, anotherEdge) {
  return (
    isPointOnEdge(edge.start, anotherEdge) 
    || isPointOnEdge(edge.end, anotherEdge)
  ); 
}

function isEdgesHaveCommonArea(edge1, edge2) {
  return (
    isEdgePointsInsideAnotherEdge(edge1, edge2) 
    || isEdgePointsInsideAnotherEdge(edge2, edge1)
  );
}

// соприкасается ли ребро с ребрами другого объекта
function isEdgeAdjoinsObjectEdges(givenEdge, objectEdges) {
  return objectEdges.some((edge) => {
    const { isSameLevel } = isEdgesOnTheSameLevel(edge, givenEdge);
    if (!isSameLevel) {
      return false;
    } else {
      return isEdgesHaveCommonArea(edge, givenEdge);
    }
  });
}

function isEdgesOfTwoObjectsAdjoined(object0Edges, object1Edges) {
  return object0Edges.some((edge) => isEdgeAdjoinsObjectEdges(edge, object1Edges));
}

export default function checkObjectsAdjoined(objects) {
  // взять из массива объекты
  // преобразовать их в массивы точек
  let objectsPoints = objects.map((object) => convertJSONObjectToPoints(object));
  // преобразовать в массивы ребер:
  let objectsEdges = objectsPoints.map((points) => getEdgesFromPoints(points));

  // составной объект можно построить, только если:
  // объекты, соприкасаясь друг с другом образуют единую цепь,
  // т.е. нет обособленных друг от друга объектов
  let adjoinedObjects = [_.cloneDeep(objectsEdges[0])];
  objectsEdges.shift();
  while (objectsEdges.length > 0) {
    let isAnythingAddedToAdjoinedObjects = false;
    // пробуем добавить хотя бы один соприкасающийся объект:
    for (let i = 0; i < adjoinedObjects.length; i += 1) {
      for (let j = 0; j < objectsEdges.length; j += 1) {
        if (isEdgesOfTwoObjectsAdjoined(adjoinedObjects[i], objectsEdges[j])) {
          adjoinedObjects.push(_.cloneDeep(objectsEdges[j]));
          objectsEdges.splice(j, 1);
          isAnythingAddedToAdjoinedObjects = true;
          break;
        }
      }
      // добавили - выходим
      if (isAnythingAddedToAdjoinedObjects) {
        break;
      } 
    }
    // если обошли весь массив и не нашли объектов на добавление, то объекты не моугт быть связаны в цепочку:
    if (!isAnythingAddedToAdjoinedObjects) {
      return false;
    } 
  }
  return true;
} 