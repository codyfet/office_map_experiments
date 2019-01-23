import * as React from 'react';
import { Shape, Layer, Line } from 'react-konva';


export default class MapShape extends React.Component {

    render() {
        // getting settings for drawing grid:
        const { width, height, blockSnapSize } = this.props;

        return (
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(20, 20);
              context.lineTo(20, 320);
              context.lineTo(320, 320);
              context.lineTo(320, 220);
              context.lineTo(260, 220);
              context.lineTo(260, 180);
              context.lineTo(620, 180);
              context.lineTo(620, 20);
              context.closePath();
              // (!) Konva specific method, it is very important
              context.fillStrokeShape(shape);
            }}
            // fill="#00D2FF"
            stroke="black"
            strokeWidth={1}
          />
        );
    }
    
};