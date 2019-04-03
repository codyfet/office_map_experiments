import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AdvancedBoard from '../AdvancedBoard/index';
import LoadingBoard from '../LoadingBoard/index';
import SidePanel from '../SidePanel/index';
import LeftPanel from '../LeftPanel/index';
import './style.css';

class GlobalArea extends React.Component {
  render() {
    const { objects, mapState } = this.props;

    // размеры основной доски:
    const width = window.innerWidth / 1.7;
    const height = window.innerHeight - 50;

    // надпись для экрана подгрузки:
    const messageForAdvancedBoard = 'Please wait. Objects loading...';
    
    let objectsToLoad = [];
    if (mapState.loading) objectsToLoad.push('MapDescription');

    const messageForSidePanel = `Please wait.\n\n${objectsToLoad.join(',\n')}\n\nloading...`;

    return (
      <div className="globalArea">
        <LeftPanel
          panelWidth={width / 8}
          panelHeight={height / 2}
          boardWidth={width}
          boardHeight={height}
        />
        { 
          objects.loading 
            ? <LoadingBoard boardWidth={width} boardHeight={height} message={messageForAdvancedBoard} />
            : <AdvancedBoard boardWidth={width} boardHeight={height} />
        }
        {
          mapState.loading
            ? (
              <LoadingBoard 
                boardWidth={width * 0.3} 
                boardHeight={height + 2} 
                message={messageForSidePanel}
              />)
            : (
              <SidePanel
                panelWidth={width * 0.3}
                panelHeight={height + 2}
                boardWidth={width}
                boardHeight={height}
              />)
        }
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  users: state.users,
  mapState: state.mapState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GlobalArea);
