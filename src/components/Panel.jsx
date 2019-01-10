import * as React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createFurniture } from '../actions/index';

class Panel extends React.Component {

  handleClick = () => {
    const { actions } = this.props;

    const newFurniture = {
      type: 'table',
      coordinates: { x: 750, y: 20 },
      position: 'horizontal'
    };

    actions.createFurniture(newFurniture);
    console.log('created', newFurniture);
    
  }

  render() {
    return (
      <div style={{
        width: '200px', 
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
  furnitures: state.furnitures
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createFurniture }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);