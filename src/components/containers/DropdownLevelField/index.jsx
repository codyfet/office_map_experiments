import range from 'lodash/range';
import * as React from 'react';

import './styles.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class DropdownLevelField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      currCategory: placeholder,
    };
  }

  componentDidUpdate(prevProps) {
    const { placeholder } = this.props;
    if (prevProps.placeholder !== placeholder) {
      this.setState({
        currCategory: placeholder,
      });
    }
  }

  handleSelect = (option) => {
    const { label, onInputChange } = this.props;
    this.setState({
      currCategory: option.value,
    });

    const newSetting = {};
    newSetting[label] = option.value;

    onInputChange(newSetting);
  };

  render() {
    const { currCategory } = this.state;
    const { label } = this.props;

    const options = range(1, 14).map(elem => {
      return {
        value: elem,
        label: elem,
      };
    });

    const defaultOption = options.find(elem => elem.value === Number(currCategory));

    return (
      <div className="editField">
        <div className="editFieldDropdownLabel">{label}</div>
        <Dropdown
          className="editFieldDropdown"
          options={options}
          onChange={this.handleSelect}
          value={defaultOption}
          placeholder={defaultOption}
        />
      </div>
    );
  }
}

export default DropdownLevelField;
