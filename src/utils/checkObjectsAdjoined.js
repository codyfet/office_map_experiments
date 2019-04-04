import { PEdge } from './EdgeClasses/PEdge';

const _ = require('lodash');

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

// соприкасается ли ребро с ребрами другого объекта
function isEdgeAdjoinsObjectEdges(givenEdge, objectEdges) {
  return objectEdges.some((edge) => PEdge.isEdgesAdjoined(givenEdge, edge));
}

function isEdgesOfTwoObjectsAdjoined(object0Edges, object1Edges) {
  return object0Edges.some((edge) => isEdgeAdjoinsObjectEdges(edge, object1Edges));
}

export default function checkObjectsAdjoined(objects) {
  // взять из массива объекты
  // преобразовать их в массивы точек
  let objectsPoints = objects.map((object) => convertJSONObjectToPoints(object));
  // преобразовать в массивы ребер:
  let objectsEdges = objectsPoints.map((points) => PEdge.getEdgesFromPoints(points));

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