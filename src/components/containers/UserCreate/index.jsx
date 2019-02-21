import * as React from 'react';
import EditField from '../../containers/EditField/index';
import CheckboxField from '../../containers/CheckboxField/index';
import DropdownLevelField from './../DropdownLevelField/index';

import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser } from '../../../actions/index';
var _ = require('lodash');

class UserCreate extends React.Component {
  state = {
    userSettings: {},
  };

  componentWillUnmount() {
    // чтобы сбросить данные:
    this.setState({
      userSettings: {},
    });
  }

  onInputChange = settings => {
    let newUserSettings = Object.assign({}, this.state.userSettings);
    newUserSettings = Object.assign(newUserSettings, settings);

    this.setState({
      userSettings: newUserSettings,
    });
  };

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCreateClick = () => {
    const { actions, user, onClose } = this.props;

    let userData = _.clone(user);
    try {
      for (let key in this.state.userSettings) {
        userData[key] = this.state.userSettings[key];
      }
    } catch (e) {
      alert('ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ' + e.message);
      return;
    }

    actions.addUser(userData);

    onClose();
  };

  render() {
    const { user } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      'id',
      'category',
      'userId',
      'title',
      'about',
      'capability',
      'phone',
      'level',
      'startdate',
    ];
    const editFieldsPanel = allowedProperties.map((prop, i) => {
      if (user === undefined) {
        return;
      }

      if (prop === 'level') {
        // сделаем список выбора уровней
        return (
          <DropdownLevelField
            key={i}
            label={prop}
            placeholder={user[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else {
        return (
          <EditField
            key={i}
            label={prop}
            placeholder={String(user[prop])}
            disabled={prop === 'id' || prop === 'category'}
            onInputChange={this.onInputChange}
          />
        );
      }
    });

    return (
      <div className="userCreateContainer">
        {editFieldsPanel}
        {user !== undefined && (
          <div className="buttonsSet">
            <button className="buttonAccept" onClick={this.onBtnCreateClick}>
              Создать
            </button>
          </div>
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addUser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserCreate);
