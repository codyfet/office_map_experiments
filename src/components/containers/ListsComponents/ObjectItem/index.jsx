import React from 'react';
import iconPaths from '../../../../res/iconPaths';
import AdvancedSVG from '../../../presentational/AdvancedSVG/index';
import './styles.css';

export default class ObjectItem extends React.Component {
  getSettingsForObject(object) {
    const rezult = {
      text: object.title,
      fill: ['black'],
      content: iconPaths[object.id],
    };

    return rezult;
  }

  onObjectClick = () => {
    const { object, onClick, isSelected } = this.props;
    if (!isSelected) {
      onClick(object.id);
    } else {
      onClick('');
    }
  };

  render() {
    const { object, isSelected } = this.props;
    const { content, text, fill } = this.getSettingsForObject(object);

    return (
      <div
        className={isSelected ? 'objectItemSelected ' : 'objectItem'}
        onClick={this.onObjectClick}
      >
        <AdvancedSVG width="30px" fill={fill} content={content} />
        <div>{text}</div>
      </div>
    );
  }
}
