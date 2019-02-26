import * as React from 'react';
import { Layer, Line, Group } from 'react-konva';

export default class KonvaGridLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    
    // загружаем данные для сетки:
    const { width, height, blockSnapSize } = props;

    this.state = {
      // borders: borders,
      verticalLines: this.drawVerticalLines(width, height, blockSnapSize),
      horizontalLines: this.drawHorizontalLines(width, height, blockSnapSize)
    };
  }

  componentDidUpdate(prevProps) {
    // если изменились данные по размерам карты:
    const { width, height, blockSnapSize } = this.props;
    if (prevProps.width !== width 
        || prevProps.height !== height 
        || prevProps.blockSnapSize !== blockSnapSize) {
      // перерисуем сетку:
      this.setState({
        verticalLines: this.drawVerticalLines(width, height, blockSnapSize),
        horizontalLines: this.drawHorizontalLines(width, height, blockSnapSize)
      });
    }
  }

  // ФУНКЦИИ ДЛЯ ОТРИСОВКИ СЕТКИ:
  drawVerticalLines(width, height, blockSnapSize) {
    const padding = blockSnapSize;
    const verticalBlocksCount = (width / blockSnapSize) ^ 0;

    return [...Array(verticalBlocksCount)].map((elem, i) => {
      return (
        <Line
          key={Number(`1${i}`)}
          points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    });
  }

  drawHorizontalLines(width, height, blockSnapSize) {
    const padding = blockSnapSize;
    const horizontalBlocksCount = (height / blockSnapSize) ^ 0;

    return [...Array(horizontalBlocksCount)].map((elem, j) => {
      return (
        <Line
          key={Number(`2${j}`)}
          points={[0, Math.round(j * padding), width, Math.round(j * padding)]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    });
  }

  render() {
    const { verticalLines, horizontalLines } = this.state;
    const { children } = this.props;

    return (
      <Layer>
        <Group>
          {verticalLines}
          {horizontalLines}
          {children}
        </Group>
      </Layer>
    );
  }
}
