import * as React from 'react';
import { Stage, Text, Layer } from 'react-konva';

class LoadingBoard extends React.Component {
  render() {
    const { boardWidth, boardHeight } = this.props;
    return (
      <div
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
              text="Please wait. Objects loading..."
              fontFamily="Arial"
              fontSize={30}
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
