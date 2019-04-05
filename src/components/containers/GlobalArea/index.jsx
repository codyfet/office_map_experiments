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
import {
  FULFILLED,
  REJECTED,
  PENDING
} from '../../../res/constantsForLoadingStatus';
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

  // getLoadingStatus = (objectsLoading) => {
  //   // objectsLoading
  //   if (objectsLoading.some((object) => object.loadingStatus === REJECTED)) {
  //     return {
  //       showAdvancedBoard: false,
  //       message: "Warning! Server doesn't answer!"  
  //     };
  //   }

  //   let message = 'Please wait!\nLoading: ';
  //   let objectsToLoad = [];
  //   if (objects.loading === PENDING) {
  //     objectsToLoad.push('objects');     
  //   }
  //   if (mapState.loading === PENDING) {
  //     objectsToLoad.push('mapDescription');  
  //   }

  //   if (objectsToLoad.length > 0) {
  //     return {
  //       showAdvancedBoard: false,
  //       message: message + objectsToLoad.join(',')  
  //     };
  //   } else {
  //     return {
  //       showAdvancedBoard: true,
  //       message: ''  
  //     };
  //   }
  // }

  getLoadingStatusForAdvancedBoard = () => {
    const { objects, mapState } = this.props;
    if (objects.loading === REJECTED || mapState.loading === REJECTED) {
      return {
        showAdvancedBoard: false,
        messageAdvancedBoard: "Warning! Server doesn't answer!"  
      };
    }

    let message = 'Please wait!\nLoading: ';
    let objectsToLoad = [];
    if (objects.loading === PENDING) {
      objectsToLoad.push('objects');     
    }
    if (mapState.loading === PENDING) {
      objectsToLoad.push('mapDescription');  
    }

    if (objectsToLoad.length > 0) {
      return {
        showAdvancedBoard: false,
        messageAdvancedBoard: message + objectsToLoad.join(', ')  
      };
    } else {
      return {
        showAdvancedBoard: true,
        messageAdvancedBoard: ''  
      };
    }
  }

  getLoadingStatusForSidePanel = () => {
    const { mapState, users, projects } = this.props;
    if (users.loading === REJECTED || projects.loading === REJECTED || mapState.loading === REJECTED) {
      return {
        showSidePanel: false,
        messageSidePanel: "Warning! Server doesn't answer!"  
      };
    }

    let message = 'Please wait!\nLoading: \n';
    let objectsToLoad = [];
    if (mapState.loading === PENDING) {
      objectsToLoad.push('mapDescription');  
    }
    if (users.loading === PENDING) {
      objectsToLoad.push('users');     
    }
    if (projects.loading === PENDING) {
      objectsToLoad.push('projects');     
    }
    

    if (objectsToLoad.length > 0) {
      return {
        showSidePanel: false,
        messageSidePanel: message + objectsToLoad.join(',\n')  
      };
    } else {
      return {
        showSidePanel: true,
        messageSidePanel: ''  
      };
    }
  }

  render() {
    // размеры основной доски:
    const width = window.innerWidth / 1.7;
    const height = window.innerHeight - 50;

    // надпись для экрана подгрузки:
    const { showAdvancedBoard, messageAdvancedBoard } = this.getLoadingStatusForAdvancedBoard();
    const { showSidePanel, messageSidePanel } = this.getLoadingStatusForSidePanel();

    return (
      <div className="globalArea">
        <LeftPanel
          panelWidth={width / 8}
          panelHeight={height / 2}
          boardWidth={width}
          boardHeight={height}
        />
        { 
          showAdvancedBoard
            ? <AdvancedBoard boardWidth={width} boardHeight={height} />
            : <LoadingBoard boardWidth={width} boardHeight={height} message={messageAdvancedBoard} /> 
        }
        {
          showSidePanel
            ? (
              <SidePanel
                panelWidth={width * 0.3}
                panelHeight={height + 2}
                boardWidth={width}
                boardHeight={height}
              />)
            : (
              <LoadingBoard 
                boardWidth={width * 0.3} 
                boardHeight={height + 2} 
                message={messageSidePanel}
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
