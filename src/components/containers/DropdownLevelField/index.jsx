import * as React from "react";

import "./styles.css";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
var _ = require('lodash');

class DropdownLevelField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      currCategory: placeholder
    }
  }

  componentDidUpdate(prevProps) {
    if ( prevProps.placeholder !== this.props.placeholder ) {
      this.setState({
        currCategory: this.props.placeholder
      });
    }
  }

  _onSelect = (option) => {
    const { label, onInputChange } = this.props;
    this.setState({
      currCategory: option.value
    });

    let newSetting = {};
    newSetting[label] = option.value;
    console.log(newSetting);
    
    onInputChange(newSetting);
  }

  render() {
    const { label } = this.props;

    const options = _.range(1, 14).map((elem) => {
      return {
          value: elem,
          label: elem
      };
    })

    var defaultOption = options.find((elem) => elem.value === Number(this.state.currCategory));

    
    return (
      <div className="editField">
        <div className="editFieldDropdownLabel">{label}</div>
        <Dropdown 
          className="editFieldDropdown"
          options={options} 
          onChange={this._onSelect} 
          value={defaultOption} 
          placeholder={defaultOption}  
        />
        
      </div>
    );
  }
  
}

export default DropdownLevelField;
