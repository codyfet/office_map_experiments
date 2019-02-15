import React from 'react';
import './style.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeBoardState } from '../../../actions/index';


class LeftPanel extends React.Component {

  autoAdjustStage = () => {
    // padding:
    const padding = 20;

    // получаем границы карты:
    const { mapWidth, mapHeight } = this.props.mapState;

    // получаем границы окна :
    const { boardWidth, boardHeight } = this.props;

    // настраиваем масштаб:
    // считаем используя отступ с 2-х сторон (поэтому * 2)
    let scaleX = boardWidth / (mapWidth + padding*2);
    let scaleY = boardHeight / (mapHeight + padding*2);

    // если реальная карта больше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY < 1),
    // то выберем наибольший масштаб:
    let newScale;
    if ( scaleX < 1 || scaleY < 1) {
      newScale = scaleX > scaleY ? scaleY : scaleX;
    } else { // иначе:
      newScale = scaleX > scaleY ? scaleX : scaleY;
    }

    // сразу в redux:
    const { actions } = this.props;
    const newState = { 
      shift: [padding*newScale, padding*newScale], 
      scale: newScale            
    };

    actions.changeBoardState(newState);

  };

  render() {
    // размеры доски:
    const { panelWidth, panelHeight } = this.props;

    return (
      <div 
        className="leftPanel"
        style={{
          width: (panelWidth + 'px'), 
          height: (panelHeight + 'px')
        }}  
      >
        <button 
          className="buttonLeftPanel"
          onClick={this.autoAdjustStage}
        >
          Авто-масштаб
        </button>
        <div className="checkboxLeftPanel">
          <input 
            className="buttonLeftPanel"
            type="checkbox"
          />
          <div className="labelLeftPanel">Групповое выделение</div> 
        </div>
         
      </div>        
    );
  }
};

// for redux:
const mapStateToProps = (state) => ({
  mapState: state.mapState,
  currentObject: state.currentObject
});
  
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ 
      changeBoardState 
  }, dispatch)
});
  
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPanel);