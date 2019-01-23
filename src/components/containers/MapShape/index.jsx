import * as React from 'react';
import { Shape, Layer, Line } from 'react-konva';


export default class MapShape extends React.Component {

    render() {
        // getting settings for drawing grid:
        const { boundaries } = this.props;

        // распарсим строку с границами:
        const borders = boundaries.split(' ').map((point) => {
            let coords = point.split(',', 2);
            return { 
                x: Number(coords[0]), 
                y: Number(coords[1]) 
            };
        });

        return (
          <Shape
            sceneFunc={(context, shape) => {
              // отрисуем границы:
              context.beginPath();
              borders.forEach((value, i) => {
                  if ( i == 0) {
                    context.moveTo(value.x, value.y);
                  } else {
                    context.lineTo(value.x, value.y); 
                  }
              });
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