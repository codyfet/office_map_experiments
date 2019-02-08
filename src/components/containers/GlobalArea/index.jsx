import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import 'react-contexify/dist/ReactContexify.min.css';
import './style.css';

export default class GlobalArea extends React.Component {

  render() {
    // размеры доски:
    const width = 800;
    const height = 800;

    return (
       <div className="globalArea"> 
          <AdvancedBoard
            width={width}
            height={height}

          />
          <SidePanel
            boardWidth={width}
            boardHeight={height}
          />
      </div>          
    );
  }
};
