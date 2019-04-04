import React from 'react';
import iconPaths from '../../../../res/iconPathsForObjectItem';
import ObjectItemSVG from '../../../presentational/ObjectItemSVG/index';
import './styles.css';

export default class ObjectItem extends React.Component {
  getSettingsForObject(object) {
    const rezult = {
      text: object.title,
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
    const { content, text } = this.getSettingsForObject(object);

    return (
      <div
        className={isSelected ? 'objectItemSelected ' : 'objectItem'}
        onClick={this.onObjectClick}
      >
        <ObjectItemSVG width="40px" height="40px" content={content} />
        <div>{text}</div>
      </div>
    );
  }
}
