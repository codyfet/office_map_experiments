import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editUser } from '../../../actions/index';

import EditField from '../EditField/index';
import DropdownLevelField from '../DropdownLevelField/index';
import './styles.css';

class UserSettings extends React.Component {
  state = {
    userSettings: {},
  };

  componentWillUnmount() {
    // чтобы сбросить данные:
    this.setState({
      userSettings: {},
    });
  }

  onInputChange = (settings) => {
    const { userSettings } = this.state;
    const newUserSettings = { ...userSettings, ...settings };
  
    this.setState({
      userSettings: newUserSettings
    });
  };

  sendChangedDataToRedux = (userData) => {
    const { actions, user } = this.props;
    const id = user.id;
    const newUserData = { ...userData, id };

    actions.editUser(newUserData);
  };

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCloseClick = () => {
    // const { closeSettings } = this.props;
    // closeSettings();
  };

  onBtnAcceptClick = () => {
    const { userSettings } = this.state;
    const userData = {};
    try {
      Object.keys(userSettings).forEach(key => {
        userData[key] = userSettings[key];
      });
    } catch (e) {
      alert(`ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ${e.message}`);
      return;
    }

    this.sendChangedDataToRedux(userData);

    // и очистить данные в state:
    this.setState({
      userSettings: {},
    });
  };

  onBtnCloseClick = () => {
    const { onClose } = this.props;
    onClose('');
  };

  render() {
    const { user } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      'id',
      'category',
      'enterpriseId',
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
      <div className="userSettingsContainer">
        {editFieldsPanel}
        {user !== undefined && (
          <div className="buttonsSet">
            <button type="submit" className="buttonAccept" onClick={this.onBtnAcceptClick}>
              Применить
            </button>
            <button type="submit" className="buttonClose" onClick={this.onBtnCloseClick}>
              Закрыть
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
  actions: bindActionCreators({ editUser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettings);
