import * as React from 'react';
import { Shape, Group, Rect } from 'react-konva';
import isEqual from 'lodash/isEqual';

export default class MapShape extends React.PureComponent {
  constructor(props) {
    super(props);

    const { borderlands } = props;
    this.state = {
      borderAreas: this.drawBorderAreas(borderlands)
    };
  }

  componentDidUpdate(prevProps) {
    // если изменились данные по граничащим областям карты:
    const { borderlands } = this.props;
    if (!isEqual(prevProps.borderlands, borderlands)) {
      // перерисуем области:
      this.setState({
        borderAreas: this.drawBorderAreas(borderlands)
      });
    }
  }

  // ФУНКЦИЯ ДЛЯ ОТРИСОВКИ ГРАНИЧАЩИХ ОБЛАСТЕЙ КАРТЫ:
  drawBorderAreas(borderlands) {
    // получим ограничивающие области:
    return borderlands.slice(0).map((val) => {
      const coords = val.split(' ', 4).map(v => Number(v));

      return (
        <Rect
          key={`${coords[0]}_${coords[1]}`}
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
  }

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
    const { borderAreas } = this.state;

    return (
      <Group name="borderAreas">
        <Shape
          sceneFunc={this.drawMapVisualBorders}
          // fill="#00D2FF"
          stroke="black"
          strokeWidth={2}
        />
        {borderAreas}
      </Group>
    );
  }
}
