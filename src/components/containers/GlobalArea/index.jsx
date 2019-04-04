import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateObjectsFromServer,
  updateMapDescriptionFromServer,
  updateUsersFromServer,
  updateProjectsFromServer
} from '../../../actions/index';

import AdvancedBoard from '../AdvancedBoard/index';
import LoadingBoard from '../LoadingBoard/index';
import SidePanel from '../SidePanel/index';
import LeftPanel from '../LeftPanel/index';
import './style.css';

class GlobalArea extends React.PureComponent {
  componentDidMount() {
    // здесь загрузим необходимые данные карты:
    const { actions } = this.props;

    actions.updateObjectsFromServer();
    actions.updateMapDescriptionFromServer();
    actions.updateUsersFromServer();
    actions.updateProjectsFromServer();
  }

  render() {
    const { objects, mapState, users, projects } = this.props;

    // размеры основной доски:
    const width = window.innerWidth / 1.7;
    const height = window.innerHeight - 50;

    // надпись для экрана подгрузки:
    const messageForAdvancedBoard = 'Please wait. Objects loading...';
    
    let objectsToLoad = [];
    if (mapState.loading) objectsToLoad.push('MapDescription');
    if (users.loading) objectsToLoad.push('Users');
    if (projects.loading) objectsToLoad.push('Projects');

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
          (mapState.loading || users.loading || projects.loading)
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
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ 
    updateObjectsFromServer,
    updateMapDescriptionFromServer,
    updateUsersFromServer,
    updateProjectsFromServer
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GlobalArea);
