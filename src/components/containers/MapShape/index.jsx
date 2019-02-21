import * as React from 'react';
import { Shape, Group, Rect } from 'react-konva';

export default class MapShape extends React.PureComponent {
  // ФУНКЦИЯ ДЛЯ ОТРИСОВКИ ВИУЗАЛЬНЫХ ГРАНИЦ КАРТЫ:
  drawMapVisualBorders = (context, shape) => {
    const { boundaries } = this.props;

    // распарсим строку с границами:
    const borders = boundaries.split(' ').map(point => {
      const coords = point.split(',', 2);
      return {
        x: Number(coords[0]),
        y: Number(coords[1]),
      };
    });

    // рисовка границ:
    context.beginPath();
    borders.forEach((value, i) => {
      if (i === 0) {
        context.moveTo(value.x, value.y);
      } else {
        context.lineTo(value.x, value.y);
      }
    });
    context.closePath();

    // (!) Konva specific method, it is very important
    context.fillStrokeShape(shape);
  };

  render() {
    // getting settings for drawing grid:
    const { borderlands } = this.props;

    // предположим, мы получили ограничивающие области:
    const borderAreas = borderlands.slice(0).map((val, i) => {
      const coords = val.split(' ', 4).map(v => Number(v));

      return (
        <Rect
          key={i}
          x={coords[0]}
          y={coords[1]}
          width={coords[2] - coords[0]}
          height={coords[3] - coords[1]}
          fill="white"
          // stroke="red"
          // strokeWidth={1}
        />
      );
    });

    return (
      <Group name="borderAreas">
        <Shape
          sceneFunc={this.drawMapVisualBorders}
          // fill="#00D2FF"
          stroke="black"
          strokeWidth={1}
        />
        {borderAreas}
      </Group>
    );
  }
}
