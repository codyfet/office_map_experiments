import * as React from 'react';
import AdvancedBoard from '../AdvancedBoard/index';
import SidePanel from '../SidePanel/index';
import 'react-contexify/dist/ReactContexify.min.css';
import './style.css';

export default class GlobalArea extends React.Component {

  state = {
    selectedObjectId: ''
  }

  changeSelectedObjectId = (id) => {
    this.setState({
      selectedObjectId: id
    });
  }

  render() {
    return (
       <div className="globalArea"> 
          <AdvancedBoard
            width={800}
            height={800}
            changeSelectedObjectId={this.changeSelectedObjectId}

          />
          <SidePanel 
            selectedObjectId={this.state.selectedObjectId}
          />
      </div>          
    );
  }
};
