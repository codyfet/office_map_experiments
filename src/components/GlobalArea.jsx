import * as React from 'react';
import DragItem from './DragItem';
import AdvancedBoard from './AdvancedBoard';
import Panel from './Panel';
import { MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import BoardContextMenu from './BoardContextMenu';

class GlobalArea extends React.Component {
  render() {
    return (
      <div style={{
        width: '100%', 
        height: '100hv',
        display: 'flex'}}>
          <MenuProvider id="menu_id" style={{ border: '1px solid purple'}}>
            <AdvancedBoard />
          </MenuProvider>
          <Panel />
          <BoardContextMenu />
      </div>          
    );
  }
}


export default GlobalArea;