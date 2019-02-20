import React from 'react';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeCurrentObject, changeCurrentUser } from '../../../actions/index';

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';

export default class CurrentObjectItem extends React.Component {
  state = {
    isSelected: false,
  };

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
    let rezult = {
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
