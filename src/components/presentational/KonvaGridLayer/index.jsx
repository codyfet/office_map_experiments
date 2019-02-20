import * as React from 'react';
import { Layer, Line, Group } from 'react-konva';

export default class KonvaGridLayer extends React.PureComponent {
  render() {
    // getting settings for drawing grid:
    const { width, height, blockSnapSize, boundaries, flushAll } = this.props;

    // распарсим строку с границами:
    const borders = boundaries.split(' ').map(point => {
      let coords = point.split(',', 2);
      return {
        x: Number(coords[0]),
        y: Number(coords[1]),
      };
    });

    let padding = blockSnapSize;
    let blocksCount = (width / blockSnapSize) ^ 0;

    const makeVerticalGrid = [...Array(blocksCount + 1)].map((elem, i) => {
      return (
        <Line
          key={Number(`1${i}`)}
          points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]}
          stroke={'#ddd'}
          strokeWidth={0.5}
        />
      );
    });

    const makeHorizontalGrid = [...Array(blocksCount + 1)].map((elem, j) => {
      return (
        <Line
          key={Number(`2${j}`)}
          points={[0, Math.round(j * padding), width, Math.round(j * padding)]}
          stroke={'#ddd'}
          strokeWidth={0.5}
        />
      );
    });

    return (
      <Layer>
        <Group
          clipFunc={context => {
            // отрисуем границы:
            context.beginPath();
            borders.forEach((value, i) => {
              if (i === 0) {
                context.moveTo(value.x, value.y);
              } else {
                context.lineTo(value.x, value.y);
              }
            });
            context.closePath();

            // // (!) Konva specific method, it is very important
            // context.fillStrokeShape(shape);
          }}
        >
          {makeVerticalGrid}
          {makeHorizontalGrid}
          {this.props.children}
        </Group>
      </Layer>
    );
  }
}
