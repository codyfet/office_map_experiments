import React from 'react';
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';

//redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeMapLevel, changeObjectsLevel } from '../../../actions/index';

// статические данные карты:
import mapData from '../../../res/mapData.json';


class MapLevelItem extends React.Component {
    
    _onSelect(option) {
        console.log(option);
    }

    render() {
        const options = mapData.levelsInfo.map((lvl) => {
            return {
                value: lvl.sortId,
                label: lvl.title
            };
        })
        const defaultOption = options[1];

        return (
            <div>
                <div style={{ textAlign: 'center' }}>CURRENT MAP LEVEL:</div>
                <Dropdown 
                    options={options} 
                    onChange={this._onSelect} 
                    value={defaultOption} 
                    placeholder={defaultOption}  
                />
            </div>         
        );
    }
};

// for redux:
const mapStateToProps = (state) => ({
    mapState: state.mapState

});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ changeMapLevel, changeObjectsLevel }, dispatch)
});
  
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapLevelItem);
 
    