import * as React from 'react';
import DragItem from './DragItem';

class GlobalArea extends React.Component {
  render() {
    return (
      <div style={{display: 'inline-block', position: 'absolute', left: '90px', right: '100px', width: 'auto', height: '200px'}}>
        <div style={{border: '1px solid black', width: '80%', height: '100%'}}>
        </div>
        <div style={{border: '1px solid blue', width: '20%', height: '100%'}}>
          <DragItem />
        </div>    
      </div>       
    );
  }
}


export default GlobalArea;