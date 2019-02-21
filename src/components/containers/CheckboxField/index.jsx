import * as React from 'react';

import './styles.css';

class CheckboxField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      isChecked: placeholder,
    };
  }

  componentDidUpdate(prevProps) {
    const { placeholder } = this.props;
    if (prevProps.placeholder !== placeholder) {
      this.setState({
        isChecked: placeholder,
      });
    }
  }

  handleChange = (e) => {
    const { label, onInputChange } = this.props;
    const { isChecked } = this.state;
    this.setState({
      isChecked: !isChecked,
    });

    const newSetting = {};
    newSetting[label] = e.target.checked;
    
    onInputChange(newSetting);
  };

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;

    return (
      <div className="editField">
        <div className="editFieldLabel">{label}</div>
        <input type="checkbox" onChange={this.handleChange} checked={isChecked} />
      </div>
    );
  }
}

export default CheckboxField;
