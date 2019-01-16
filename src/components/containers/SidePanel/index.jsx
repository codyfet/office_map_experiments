import * as React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject } from '../../../actions/index';

// статические данные карты:
import mapData from '../../../res/mapData.json';

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.levelNum = 1;

    this.state = {
      idCounter: mapData.levels[this.levelNum].movableIdNext
    };
  }
  
  getNewId() {
    const curr_id = this.state.idCounter;
    this.setState({
      idCounter: this.state.idCounter + 1
    });
    return curr_id; 
  }

  getConvertedCoordsFrom(x, y) {
    const { shift, scale } = this.props.boardState;
    console.log('SidePanel', scale, shift);
    
    return { 
      x: (x - shift[0])/scale, 
      y: (y - shift[1])/scale
    };
    
  }

  handleClick = () => {
    const { actions } = this.props;
    
    const newObject = {
      type: 'table',
      id: this.getNewId(),
      coordinates: this.getConvertedCoordsFrom(750, 20),
      width: 20,
      height: 30
    };

    actions.createObject(newObject);
    console.log('created', newObject);
    
  }

  render() {

    return (
      <div style={{
        width: '300px', 
        height: '810px',
        border: '1px solid black'
        }}
      >
        <button 
          style={{width: '100%'}}
          onClick={this.handleClick}
        >
          Create
        </button>
      </div>
      
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  objects: state.objects,
  boardState: state.boardState
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createObject }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);