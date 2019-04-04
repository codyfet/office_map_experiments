// divideEdgesIntoHorizontalAndVerical,
// getVisibleHorizontalAndVerticalEdges,
// divideIntoDrakAndLightHorizontalEdges,
// divideIntoDrakAndLightVerticalEdges,
// divideIntoDrakAndLightEdges,
import {
  DOWN,
  RIGHT,
  DARK,
  LIGHT,
  GREY
} from './edgeConstants';
import { PEdge } from './PEdge';

// класс предназанчен для ребер, параллельных оси Ox/Oy -
// назовем такие ребра: Perpendicular To Axis => P
class ContrastPEdge extends PEdge {
  constructor(startPoint, endPoint) {
    super(startPoint, endPoint);
    this.visible = this.isVisible();
    this.brightness = this.getBrightness();
  }

  getBrightness() {
    switch (this.direction) {
      case DOWN:
        return DARK;
      case RIGHT:
        return LIGHT;
      default:
        return GREY;
    }
  }

  isVisible() {
    return this.direction === DOWN || this.direction === RIGHT;
  }

  static getEdgesFromPoints(points) {
    let edges = [];
    // проверяем, есть ли замыкающая точка:
    if (points[0] !== points.slice(-1)[0]) {
      points.push(points[0]);
    }
    points.reduce((prev, v) => {
      edges.push(new ContrastPEdge(prev, v));
      return v;
    });
    return edges;
  }

  static getDarkEdges(contrastPEdges) {
    return contrastPEdges.filter((edge) => edge.brightness === DARK);
  }

  static getVisibleDarkEdges(contrastPEdges) {
    return contrastPEdges.filter((edge) => edge.brightness === DARK && edge.visible);
  }

  static getLightEdges(contrastPEdges) {
    return contrastPEdges.filter((edge) => edge.brightness === LIGHT);
  }

  static getVisibleLightEdges(contrastPEdges) {
    return contrastPEdges.filter((edge) => edge.brightness === LIGHT && edge.visible);
  }
}

export {
  ContrastPEdge
};
