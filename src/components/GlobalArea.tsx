import * as React from 'react';
import DragItem from './DragItem';

class GlobalArea extends React.Component {
  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div style={{border: '1px solid black', width: '80%', height: '100%'}}>
        </div>
        <div style={{border: '1px solid blue', width: '20%', height: '100%'}}>
        </div>    
      </div>       
    );
  }
}


export default GlobalArea;