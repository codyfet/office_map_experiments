export default function shiftPolygonPoints(polygonPoints) {
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