import React from 'react';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';

export default class CurrentObjectItem extends React.Component {
  getSettingsForObject(object) {
    // на случай, если объект пустой:
    if (object === undefined) {
      return {
        text: 'Unknown',
        fill: ['black'],
        content: iconPaths.table,
      };
    }

    // иначе:
    const rezult = {
      text: objectCategories.find(cat => cat.id === object.category).title,
      fill: ['black'],
      content: iconPaths[object.category],
    };

    return rezult;
  }

  render() {
    const { object } = this.props;
    const { content, text, fill } = this.getSettingsForObject(object);

    return (
      <div className="currentObjectItemSelected">
        <AdvancedSVG width="30px" fill={fill} content={content} />
        <div>{text}</div>
      </div>
    );
  }
}
