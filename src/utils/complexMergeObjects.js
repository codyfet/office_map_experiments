const _ = require('lodash');

// EDGES ORIENTATION:
const HORIZONTAL = 'HORIZONTAL';
const VERTICAL = 'VERTICAL';

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
  return false;
}

// работает в целых числах:
function getEdgesThePointIsOn(point, edges) {
  let foundEdges = [];
  edges.forEach((edge) => {
    if (isEdgeHorizontal(edge)) {
      if (edge.start.x <= point.x && edge.end.x >= point.x) {
        foundEdges.push(_.cloneDeep(edge));
      } 
    } else if (isEdgeVertical(edge)) {
      if (edge.start.y <= point.y && edge.end.y >= point.y) {
        foundEdges.push(_.cloneDeep(edge));
      }
    } else {
      // уравнение прямой:
      let leftExp = (point.x - edge.start.x) / (edge.end.x - edge.start.x);
      let rightExp = (point.y - edge.start.y) / (edge.end.y - edge.start.y);
      if (Math.floor(leftExp) === Math.floor(rightExp)) {
        foundEdges.push(_.cloneDeep(edge));
      }
    }
  });
  return foundEdges;
}

function getPointsOnEdge(edge, otherObjectEdges) {

}

function computeDistanceBetweenPoints(point1, point2) {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

// найти точку, ближайшую к center = 0,0:
function getPointClosestToCenter(points, center = { x: 0, y: 0 }) { 
  return points.reduce((prev, v) => {
    let fromPrevToCenter = computeDistanceBetweenPoints(prev, center);
    let fromVToCenter = computeDistanceBetweenPoints(v, center);
    return fromPrevToCenter >= fromVToCenter ? v : prev;
  });
}

// ребро соприкасается с другими ребрами
function getEdgesGivenEdgeAdjoins(givenEdge, anotherObjectEdges) {
  let foundEdges = [];
  anotherObjectEdges.forEach((edge) => {
    const { isSameLevel, orientation } = isEdgesOnTheSameLevel(edge, givenEdge);
    if (isSameLevel && orientation === HORIZONTAL) {
      if (edge.start.x <= givenEdge.start.x && edge.end.x >= givenEdge.start.x
          || edge.start.x <= givenEdge.end.x && edge.end.x >= givenEdge.end.x) {
        foundEdges.push(_.cloneDeep(edge));
      }
    } 
    if (isSameLevel && orientation === VERTICAL) {
      if (edge.start.y <= givenEdge.start.y && edge.end.y >= givenEdge.start.y
          || edge.start.y <= givenEdge.end.y && edge.end.y >= givenEdge.end.y) {
        foundEdges.push(_.cloneDeep(edge));
      }
    } 
  });
  return foundEdges;
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
    bottomRightCorner.x = x + width > topLeftCorner.x ? x + width : bottomRightCorner.x;
    bottomRightCorner.y = y + height > topLeftCorner.y ? y + height : bottomRightCorner.y;
  });
  return {
    topLeftCorner, 
    bottomRightCorner
  };
}

function complexMergeObjects(objects, finalCategory) {
  // взять из массива объекты
  // преобразовать их в массивы точек-ребер:
  let str = 'Функция работает';
  let begin = 'Начинаем разработку';
  
  let objectsPoints = objects.map((object) => convertJSONObjectToPoints(object));
  let objectEdges = objectsPoints.map((points) => getEdgesFromPoints(points));
  
  // берем два объекта:
  let object0 = objectEdges[0];
  let object1 = objectEdges[1];

  let newObject = [];
  // и начинаем обход:
  for (let i = 0; i < object0.length; i += 1) {
    // проходим ребро
    let currentEdge = object0[i];
    // смотрим, соприкасается ли оно с ребром другого объекта:
    let adjoinedEdges = getEdgesGivenEdgeAdjoins(currentEdge, object1);

    if (adjoinedEdges !== []) {
      // предположим, что соприкосновение может быть только по одному ребру:
      let adjoinedEdge = _.cloneDeep(adjoinedEdges[0]);
      let sortedPoints = [currentEdge.start, currentEdge.end, adjoinedEdge.start, adjoinedEdge.end];
      
      // если соприкосновение горизонтальных ребер:
      if (isEdgeHorizontal(adjoinedEdge)) {
        sortedPoints = sortedPoints.sort((a, b) => a.x - b.x);
        // случай 1: примыкающее ребро (adjoinedEdge) внутри текущего ребра (currentEdge):
        if (isEdge1InsideEdge2(adjoinedEdge, currentEdge, 'horizontal')) {
          // Первое новое ребро:
          newObject.push({
            start: sortedPoints[0],
            end: sortedPoints[1] 
          });
          object1 = deleteByValue(object1, currentEdge);

          let currPoint = sortedPoints[0];
          while (object1 !== []) {
            let nextEdge = _.cloneDeep(findEdgeByPoint(currPoint, object1));
            newObject.push(nextEdge);
            object1 = deleteByValue(object1, nextEdge);
            currPoint = nextEdge.end;
          }
        }
      } else if (isEdgeVertical(adjoinedEdge)) {
        // 
      }
    } else {
      newObject.push(_.cloneDeep(currentEdge));
    }
  }

  let polygonDots = newObject;
} 

function findStartPoint(start, borders, points) {
  for (let x = start.x; x < borders.x; x += step) {
    for (let y = start.y; y < borders.y; y += step) {
      let tempPoint = points.find((p) => _.isEqual(p, { x, y }));
      return {
        point: _.cloneDeep(tempPoint),
        direction: DOWN
      };
    }
  }
  return undefined;
}

export default function mergeObjects(objects, step = 5, finalCategory = 'service_room') {
  // LAZY MERGE:
  
  // взять из массива объекты
  // преобразовать их в массивы точек-ребер:
  let str = 'Функция работает';
  let begin = 'Начинаем разработку';
  
  // работаем на двух объектах:
  // сначала определим размер области, в которой лежат наши объекты:
  const { topLeftCorner, bottomRightCorner } = computeAreaSizes(objects);
  
  let points = objects.map((object) => convertJSONObjectToPoints(object)).flat();
  
  // теперь объединение точек в один полигон:
  let sortedPoints = [];
  // !!!!!!!!!!!!!!!!!!!!
  let start = topLeftCorner;
  let borders = bottomRightCorner;

  let startPoint = findStartPoint(start, borders, points);
  // теперь идем от точки, объодя соседние области:
  // в зависимости от направления вектора

//   for (let x = start.x; x < borders.x; x += step) {
//     for (let y = start.y; y < borders.y; y += step) {
//       let tempPoint = points.find((p) => _.isEqual(p, { x, y }));
//       sortedPoints.push(_.cloneDeep(tempPoint));
      
//   }
  
//   if (tempObject !== undefined) { 
//     // нашли объект:

//     // 1. Проверим область "ЗА ОБЪЕКТОМ":
//     let startPoint = { x: start.x, y: y + step };
//     let newBorders = { x: x + tempObject.width, y: y + tempObject.height };
//     sortedObjects = sortedObjects.concat(exploreAreaFrom(startPoint, newBorders, step, objects));
    
//     sortedObjects.push(_.cloneDeep(tempObject));
//     // return sortedObjects;
//   }
// }
//   let walkingStart = 'yes';
  // // берем два объекта:
  // let object0 = objectsPoints[0];
  // let object1 = objectsPoints[1];

  // let newObject = [];

  // newObject.push(object0[0]);
  // for (let i = 0; i < object0.length - 1; i += 1) {
  //   let point = object0[i];
  //   let nextPoint = object0[i + 1];
  //   // пойдём от точки до точки
  //   // определимся как будем идти:
  //   if (point.x === nextPoint.x) {
  //     // тогда вдоль y:
  //     for (let y = point.y; y <= nextPoint.y; y += step) {
  //       // проверяем:
  //       // есть ли такая же точка в другом объекте:
  //       let newPoint = object1.find((p) => _.isEqual(p, { x: point.x, y }));
  //       if (newPoint !== undefined) {
  //         newObject.push(newPoint);
  //         let keyPoint = object1.indexOf(newPoint);
  //         for (let j = keyPoint; j < object1.length; j += 1) {
  //           newObject.push(object1[j]);
  //         }
  //         for (let j = 0; j < keyPoint; j += 1) {
  //           newObject.push(object1[j]);
  //         }
  //       }
  //     }
  //   } else if (point.y === nextPoint.y) {
  //     // тогда вдоль x:
  //     for (let x = point.x; x <= nextPoint.x; x += step) {
  //       // проверяем:
  //     }
  //   }
  //   newObject.push(nextPoint);
  // }
  // return newObject.join(' ');
} 