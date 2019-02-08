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

    _onSelect = (option) => {
        const { onSelectLevel } = this.props;
        console.log('Change level on:', option.value);
        onSelectLevel(option.value);
    }

    render() {
        const options = mapData.levelsInfo.map((lvl) => {
            return {
                value: lvl.sortId,
                label: lvl.title
            };
        })

        const { currentLevel } = this.props;
        var defaultOption = mapData.levelsInfo.find((lvl) => lvl.sortId === currentLevel);
        defaultOption = {
            value: defaultOption.sortId,
            label: defaultOption.title
        };

        return (
            <div>
                <div style={{ textAlign: 'center' }}>Текущая карта:</div>
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
 
    