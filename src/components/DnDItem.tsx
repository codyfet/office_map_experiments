import React from 'react';
import { DragSource } from 'react-dnd';
// import { ItemTypes } from './Constants';

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
    CARD: 'card'
  };
  
  /**
   * Specifies the drag source contract.
   * Only `beginDrag` function is required.
   */
const cardSource = {
    beginDrag(props: any) {
      // Return the data describing the dragged item
      const item = { id: props.id };
      return item;
    },
  
    endDrag(props: any, monitor: any, component: any) {
      if (!monitor.didDrop()) {
        return;
      }
  
      // When dropped on a compatible target, do something
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      // CardActions.moveCardToList(item.id, dropResult.listId);
    }
  };
  
  /**
   * Specifies which props to inject into your component.
   */
  function collect(connect: any, monitor: any) {
    return {
      // Call this function inside render()
      // to let React DnD handle the drag events:
      connectDragSource: connect.dragSource(),
      // You can ask the monitor about the current drag state:
      isDragging: monitor.isDragging()
    };
  }
  
  function Card(props: any) {
    // Your component receives its own props as usual
    const { id } = props;
  
    // These two props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isDragging, connectDragSource } = props;
  
    return connectDragSource(
      <div>
        I am a draggable card number {id}
        {isDragging && ' (and I am being dragged now)'}
      </div>
    );
  }
  
  // Export the wrapped version
  export default DragSource(Types.CARD, cardSource, collect)(Card);