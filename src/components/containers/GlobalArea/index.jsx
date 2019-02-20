import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import LeftPanel from '../LeftPanel/index';
import 'react-contexify/dist/ReactContexify.min.css';
import './style.css';

export default class GlobalArea extends React.Component {
  render() {
    // размеры основной доски:
    const width = window.innerWidth / 1.7;
    const height = window.innerHeight - 50;

    // console.log('global window sizes: ', window.innerWidth, window.innerHeight);

    return (
      <div className="globalArea">
        <LeftPanel
          panelWidth={width / 8}
          panelHeight={height / 2}
          boardWidth={width}
          boardHeight={height}
        />
        <AdvancedBoard boardWidth={width} boardHeight={height} />
        <SidePanel
          panelWidth={width * 0.3}
          panelHeight={height + 2}
          boardWidth={width}
          boardHeight={height}
        />
      </div>
    );
  }
}
