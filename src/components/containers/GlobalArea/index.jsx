import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import 'react-contexify/dist/ReactContexify.min.css';
import './style.css';

export default class GlobalArea extends React.Component {
  render() {
    return (
       <div className="globalArea"> 
          <AdvancedBoard
            width={800}
            height={800}
          />
          <SidePanel />
      </div>          
    );
  }
};
