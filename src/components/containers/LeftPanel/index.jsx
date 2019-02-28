import React from 'react';
import './style.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeBoardState, changeWorkMode } from '../../../actions/index';
import { SINGLE_EDIT, MULTI_EDIT } from '../../../res/workModeConstants';

class LeftPanel extends React.Component {
  autoAdjustStage = () => {
    // padding:
    const padding = 20;

    // получаем границы карты:
    const { mapState } = this.props;

    // получаем границы окна :
    const { boardWidth, boardHeight } = this.props;

    // настраиваем масштаб:
    // считаем используя отступ с 2-х сторон (поэтому * 2)
    const scaleX = boardWidth / (mapState.mapWidth + padding * 2);
    const scaleY = boardHeight / (mapState.mapHeight + padding * 2);

    // если реальная карта больше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY < 1),
    // то выберем наибольший масштаб:
    let newScale;
    if (scaleX < 1 || scaleY < 1) {
      newScale = scaleX > scaleY ? scaleY : scaleX;
    } else {
      // иначе:
      newScale = scaleX > scaleY ? scaleX : scaleY;
    }

    // сразу в redux:
    const { actions } = this.props;
    const newState = {
      shift: [padding * newScale, padding * newScale],
      scale: newScale,
    };

    actions.changeBoardState(newState);
  };

  handleChange = (e) => {
    const { actions } = this.props;
    const newWM = e.target.checked ? MULTI_EDIT : SINGLE_EDIT;
    actions.changeWorkMode(newWM);
  };

  handleZoomIn = () => {
    const { actions, boardState } = this.props;
    const scaleBy = 1.5;
    const newScale = boardState.scale * scaleBy; 

    const newState = {
      shift: boardState.shift,
      scale: newScale
    };

    actions.changeBoardState(newState);
  };
  
  handleZoomOut = () => {
    const { actions, boardState } = this.props;
    const scaleBy = 1.5;
    const newScale = boardState.scale / scaleBy; 

    const newState = {
      shift: boardState.shift,
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
          width: `${panelWidth}px`,
          height: `${panelHeight}px`,
        }}
      >
       
        <div className="labelLeftPanel">Масштаб карты</div>
        <div className="buttonsSet">
          <button type="submit" className="buttonZoomIn" onClick={this.handleZoomIn}>
            +
          </button>
          <button type="submit" className="buttonZoomOut" onClick={this.handleZoomOut}>
            -
          </button>
        </div> 
        <button type="submit" className="buttonLeftPanel" onClick={this.autoAdjustStage}>
          Авто-масштаб
        </button>
        <div className="checkboxLeftPanel">
          <input className="buttonLeftPanel" type="checkbox" onChange={this.handleChange} />
          <div className="labelLeftPanel">Групповое выделение</div>
        </div>
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  mapState: state.mapState,
  currentObject: state.currentObject,
  boardState: state.boardState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      changeBoardState,
      changeWorkMode,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftPanel);
