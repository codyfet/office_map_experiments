import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser } from '../../../actions/index';

import EditField from '../EditField/index';
import DropdownLevelField from '../DropdownLevelField/index';
import './styles.css';

const _ = require('lodash');

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
    const { userSettings } = this.state;
    let newUserSettings = Object.assign({}, userSettings);
    newUserSettings = Object.assign(newUserSettings, settings);

    this.setState({
      userSettings: newUserSettings,
    });
  };

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCreateClick = () => {
    const { actions, user, onClose } = this.props;
    const { userSettings } = this.state;

    const userData = _.clone(user);
    try {
      Object.keys(userSettings).forEach(key => {
        userData[key] = userSettings[key];
      });
    } catch (e) {
      alert(`ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ${e.message}`);
      return;
    }

    actions.addUser(userData);

    onClose();
  };

  onBtnCancelClick = () => {
    const { onClose } = this.props;
    onClose();
  }

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
      'projectId'
    ];
    const editFieldsPanel = allowedProperties.map((prop) => {
      if (user === undefined) {
        return undefined;
      }

      if (prop === 'level') {
        // сделаем список выбора уровней
        return (
          <DropdownLevelField
            key={prop}
            label={prop}
            placeholder={user[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else {
        return (
          <EditField
            key={prop}
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
            <button type="submit" className="buttonAccept" onClick={this.onBtnCreateClick}>
              Создать
            </button>
            <button type="submit" className="buttonCancel" onClick={this.onBtnCancelClick}>
              Отменить
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
