import * as React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createFurniture } from '../../../actions/index';

class SidePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idCounter: 0
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
    const { shift, scale, size } = this.props.boardState;
    console.log('SidePanel', scale, shift);
    
    return { 
      x: x/scale - shift[0],
      y: y/scale - shift[1]
    };
  }

  handleClick = () => {
    const { actions } = this.props;
    
    const newFurniture = {
      type: 'table',
      id: this.getNewId(),
      coordinates: this.getConvertedCoordsFrom(750, 20),
      width: 20,
      height: 30
    };

    actions.createFurniture(newFurniture);
    console.log('created', newFurniture);
    
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
  furnitures: state.furnitures,
  boardState: state.boardState
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createFurniture }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);