import * as React from 'react';
import { Stage, Text, Layer } from 'react-konva';

class LoadingBoard extends React.Component {
  render() {
    const { boardWidth, boardHeight, message, className } = this.props;
    return (
      <div
        className={className}
        style={{
          border: '1px solid black',
        }}
      >
        <Stage
          width={boardWidth}
          height={boardHeight}
        >
          <Layer>
            <Text
              text={message}
              fontFamily="Arial"
              fontSize={24}
              padding={10}
              fill="black"
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default LoadingBoard;
