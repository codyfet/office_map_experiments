import * as React from 'react';
import { Shape, Group, Rect, Layer, Line } from 'react-konva';


// раздел внешней области на прямоугольники:
// на вход подаётся:
//  - массив точек, вида { x: , y: }
//  - step - размер минимального шага (blockSnapSize)
//  - globalAreaSize - размер всего слоя KonvaGridLayer: { width: , height: }
function getBoundariesLikeRectangles(borders, step, globalAreaSize) {
  // результат - массив объектов:
  let result = [ {} ];

  // определим начальную точку/точки, от которой/которых будем строить области:
  let starPoints = [ [0,0] ];
  
  // идём вдоль оси oX:
  for ( let x = 0; x < globalAreaSize.width; x += step ) {
      // смотрим все точки вдоль оси oY:
      for ( let y = 0; y < globalAreaSize.height; y += step ) {
          // идём по нашему массиву:
          for ( let p = 0; p < borders.length; p++ ) {
              // попалась точка:
              if ( borders[p].x == x && borders[p].y ) {
                  //это первая точка, тогда у нас точно будет область сверху
                  starPoints
              }    
          }

          
          
      }

  }


}

export default class MapShape extends React.Component {

    render() {
        // getting settings for drawing grid:
        const { borderlands, boundaries, onMouseEnter, onMouseLeave, onMouseOver } = this.props;

        // предположим, мы получили ограничивающие области:
        const borderAreas = borderlands.slice(0).map( (val, i) => {
          let coords = val.split(' ', 4).map( v => Number(v) );

          return (
            <Rect
              key={i}
              x={ coords[0] }
              y={ coords[1] }
              width={ coords[2] - coords[0] }
              height={ coords[3] - coords[1] }
              fill={'white'}
              stroke={'red'}
              strokeWidth={1}  
              name='right' // указывает, есть ли пересечения с другими  
            />
          );

        });



        // распарсим строку с границами:
        const borders = boundaries.split(' ').map((point) => {
            let coords = point.split(',', 2);
            return { 
                x: Number(coords[0]), 
                y: Number(coords[1]) 
            };
        });

        return (
          <Group
            name="borderAreas"
          >
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
            {borderAreas}
          </Group>
        );
    }
    
};