import * as React from 'react';
import './styles.css';

class EditField extends React.Component {
  constructor(props) {
    super(props);

    const { placeholder } = this.props;
    this.state = {
      inputText: placeholder,
    };
  }

  componentDidUpdate(prevProps) {
    const { placeholder } = this.props;
    if (prevProps.placeholder !== placeholder) {
      this.setState({
        inputText: placeholder,
      });
    }
  }

  onTextChange = e => {
    const { label, onInputChange } = this.props;
    this.setState({
      inputText: e.target.value,
    });

    const newSetting = {};
    newSetting[label] = e.target.value;
    
    onInputChange(newSetting);
  };

  render() {
    const { inputText } = this.state;
    const { label, disabled } = this.props;

    return (
      <div className="editField">
        <div className="editFieldLabel">{label}</div>
        <input
          className="editFieldInput"
          type="text"
          value={inputText}
          disabled={disabled}
          onChange={this.onTextChange}
        />
      </div>
    );
  }
}

export default EditField;
