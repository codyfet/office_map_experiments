import * as React from 'react';
import './styles.css';

class EditPositionField extends React.Component {
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
    let coordinates = e.target.value.split(',').map(elem => elem.trim());
    newSetting[label] = {
      x: Number(coordinates[0]),
      y: Number(coordinates[1])
    };
    
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

export default EditPositionField;
