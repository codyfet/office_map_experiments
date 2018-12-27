import * as React from 'react';
import DragItem from './DragItem';
import Board from './Board';
import Panel from './Panel';

class GlobalArea extends React.Component {
  render() {
    return (
      <div style={{
        width: '100%', 
        height: '100hv',
        display: 'flex'}}>
          <Board />
          <Panel />
      </div>          
    );
  }
}


export default GlobalArea;