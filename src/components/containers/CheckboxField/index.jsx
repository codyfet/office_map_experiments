import * as React from "react";

import "./styles.css";

class CheckboxField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      isChecked: placeholder
    }
  }

  handleChange = (e) => {
    const { label, onInputChange } = this.props;
    this.setState({
      isChecked: !this.state.isChecked
    });

    let newSetting = {};
    newSetting[label] = e.target.checked;
    console.log(newSetting);
    
    onInputChange(newSetting);

  }

  render() {
    const { label, disabled } = this.props;
    
    return (
      <div className="editField">
        <div className="editFieldLabel">{label}</div>
        <input 
          type="checkbox"
          onChange={this.handleChange} 
          checked={this.state.isChecked} 
        />
        
      </div>
    );
  }
  
}

export default CheckboxField;
