import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import 'react-contexify/dist/ReactContexify.min.css';
import './style.css';

export default class GlobalArea extends React.Component {

  render() {
    // размеры доски:
    const width = 900;
    const height = 900;

    return (
       <div className="globalArea"> 
          <AdvancedBoard
            boardWidth={width}
            boardHeight={height}

          />
          <SidePanel
            boardWidth={width}
            boardHeight={height}
          />
      </div>          
    );
  }
};
