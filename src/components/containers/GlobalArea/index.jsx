import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import { MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import ContextMenuView from '../../presentational/ContextMenuView/index';
import './style.css';

class GlobalArea extends React.Component {
  render() {
    return (
       <div className="globalArea">
          <MenuProvider id="menu_id" className="menuProviderStyle">
            <AdvancedBoard
              width={800}
              height={800}
              blockSnapSize={10} 
            />
          </MenuProvider>
          <SidePanel />
          <ContextMenuView />
      </div>          
    );
  }
}


export default GlobalArea;