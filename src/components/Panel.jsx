import * as React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

class Panel extends React.Component {
//   componentDidMount() {
//     this.updateCanvas();
//   }
//   updateCanvas() {
//     const ctx = this.refs.canvas.getContext('2d');
//     ctx.fillRect(0,0, 100, 100);
//   }
  render() {
    return (
      <div style={{
        width: '200px', 
        height: '810px',
        border: '1px solid black'
        }}
      >
        <button style={{width: '100%'}}>Create</button>
      </div>
      
    );
  }
}


export default Panel;