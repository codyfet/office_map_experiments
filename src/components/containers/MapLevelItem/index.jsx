import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeMapLevel, changeObjectsLevel } from '../../../actions/index';

class MapLevelItem extends React.Component {
  handleSelect = (option) => {
    const { onSelectLevel } = this.props;
    onSelectLevel(option.value);
  };

  render() {
    const { mapState } = this.props;
    const options = mapState.description.map((lvl) => {
      return {
        value: lvl.sortId,
        label: lvl.title,
      };
    });

    const { currentLevel } = this.props;
    let defaultOption = options.find((option) => option.value === currentLevel);
    defaultOption = defaultOption !== undefined ? defaultOption : { value: 0, label: '?' };

    return (
      <div>
        <div style={{ textAlign: 'center' }}>Текущая карта:</div>
        <Dropdown
          options={options}
          onChange={this.handleSelect}
          value={defaultOption}
          placeholder={defaultOption}
        />
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  mapState: state.mapState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ changeMapLevel, changeObjectsLevel }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapLevelItem);
