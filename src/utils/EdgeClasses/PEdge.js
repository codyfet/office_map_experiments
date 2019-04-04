import {
  DOWN,
  RIGHT,
  UP,
  LEFT,
  ERROR,
  VERTICAL,
  HORIZONTAL
} from './edgeConstants';

// класс предназанчен для ребер, параллельных оси Ox/Oy -
// назовем такие ребра: Perpendicular To Axis => P
class PEdge {
  constructor(startPoint, endPoint) {
    this.start = { ...startPoint };
    this.end = { ...endPoint };
    this.orientation = this.getOrientation();
    this.direction = this.getDirection();
    this.length = this.getLength();
  }

  isHorizontal() {
    return this.start.y === this.end.y;
  }

  isVertical() {
    return this.start.x === this.end.x;
  }

  getOrientation() {
    if (this.isVertical()) return VERTICAL;
    if (this.isHorizontal()) return HORIZONTAL;
    return ERROR;
  }

  getDirection() {
    if (this.isVertical()) {
      if (this.start.y < this.end.y) {
        return DOWN;
      }
      if (this.start.y > this.end.y) {
        return UP;
      }
    }
    if (this.isHorizontal()) {
      if (this.start.x < this.end.x) {
        return RIGHT;
      }
      if (this.start.x > this.end.x) {
        return LEFT;
      }
    } 
    return ERROR;
  }

  getLength() {
    if (this.orientation === VERTICAL) {
      return Math.abs(this.start.y - this.end.y);
    }
    if (this.orientation === HORIZONTAL) {
      return Math.abs(this.start.x - this.end.x);
    }
    return -1;
  }

  getEdgeMiddlePoint() {
    return {
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2
    };
  }

  isOnTheSameLineWithEdge(pEdge) {
    if (this.orientation === pEdge.orientation) {
      if (this.isHorizontal() && this.start.y === pEdge.start.y) {
        return true;
      }
      if (this.isVertical() && this.start.x === pEdge.start.x) {
        return true;
      }
    }

    return false;
  }

  isOnTheSameLineWithPoint(point) {
    return (
      this.isVertical() && this.start.x === point.x
      || this.isHorizontal() && this.start.y === point.y
    );
  }

  containsPoint(point) {
    if (this.isOnTheSameLineWithPoint(point)) {
      if (this.isHorizontal()) {
        return (
          this.start.x <= point.x && point.x <= this.end.x
          || this.start.x >= point.x && point.x >= this.end.x); 
      }
      if (this.isVertical()) {
        return (
          this.start.y <= point.y && point.y <= this.end.y
          || this.start.y >= point.y && point.y >= this.end.y);
      }
    }

    return false;
  }

  containsPointsFromEdge(edge) {
    return this.containsPoint(edge.start) || this.containsPoint(edge.end);
  }

  // ребра соприкасаются?
  // т.е. лежат на одной прямой и имеют общую область
  static isEdgesAdjoined(pEdge1, pEdge2) {
    return (
      pEdge1.containsPointsFromEdge(pEdge2)
      || pEdge2.containsPointsFromEdge(pEdge1)
    );
  }

  static getEdgesFromPoints(points) {
    let edges = [];
    // проверяем, есть ли замыкающая точка:
    if (points[0] !== points.slice(-1)[0]) {
      points.push(points[0]);
    }
    points.reduce((prev, v) => {
      edges.push(new PEdge(prev, v));
      return v;
    });
    return edges;
  }

  // при условии - что edges - это именно массив из Edge-объектов:
  static getShortEdges(edges) {
    const shortestEdge = edges.reduce((prev, v) => (prev.length <= v.length ? prev : v));
    return edges.filter((edge) => edge.length === shortestEdge.length);
  }
}

export {
  PEdge
};

// getVisibleEdges,
// divideEdgesIntoHorizontalAndVerical,
// getVisibleHorizontalAndVerticalEdges,
// divideIntoDrakAndLightHorizontalEdges,
// divideIntoDrakAndLightVerticalEdges,
// divideIntoDrakAndLightEdges,
