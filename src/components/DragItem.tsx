import * as React from 'react';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import './globalAreaStyles.css';

export default class DragItem extends React.Component {
  eventLoReact = (e: MouseEvent, data: Object) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  };

  handler = () => {
      console.log('handler', 'empty');
  };
    
  render() {
    return (
      <Draggable 
        cancel="strong"
        defaultPosition={{x: 0, y: 0}}
        grid={[20, 20]}
        onStart={this.handler}
        onDrag={this.handler}
        onStop={this.handler}>
        <div className="box">
           Drag from here
           This readme is really dragging on...
        </div>
      </Draggable>
    );
  }

}
