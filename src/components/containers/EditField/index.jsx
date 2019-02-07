import * as React from "react";

import "./styles.css";
import ReactDropdown from "react-dropdown";

class EditField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      inputText: placeholder
    }
  }

  onTextChange = (e) => {
    const { label, onInputChange } = this.props;
    this.setState({
      inputText: e.target.value 
    });

    let newSetting = {};
    newSetting[label] = e.target.value;
    // console.log(newSetting);
    
    onInputChange(newSetting);

  }

  render() {
    const { label, disabled } = this.props;
    
    return (
      <div className="editField">
        <div className="editFieldLabel">{label}</div>
        <input
          className="editFieldInput"
          type="text"
          value={this.state.inputText}
          disabled={disabled}
          onChange={this.onTextChange}
        />
      </div>
    );
  }
  
}

export default EditField;
