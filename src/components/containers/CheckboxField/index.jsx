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

  componentDidUpdate(prevProps) {
    if ( prevProps.placeholder !== this.props.placeholder ) {
      this.setState({
        isChecked: this.props.placeholder
      });
    }
  }

  handleChange = (e) => {
    const { label, onInputChange } = this.props;
    this.setState({
      isChecked: !this.state.isChecked
    });

    let newSetting = {};
    newSetting[label] = e.target.checked;
    // console.log(newSetting);
    
    onInputChange(newSetting);

  }

  render() {
    const { label, placeholder, disabled } = this.props;
    
    console.log('checkbox', placeholder);

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
