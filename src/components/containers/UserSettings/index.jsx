import * as React from 'react';
import EditField from '../../containers/EditField/index';
import CheckboxField from '../../containers/CheckboxField/index';
import DropdownLevelField from './../DropdownLevelField/index';

import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editUser } from '../../../actions/index';

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';

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

  onInputChange = settings => {
    let newUserSettings = Object.assign({}, this.state.userSettings);
    newUserSettings = Object.assign(newUserSettings, settings);

    this.setState({
      userSettings: newUserSettings,
    });
  };

  sendChangedDataToRedux = userData => {
    const { actions, user } = this.props;
    let newUserData = Object.assign({}, userData);
    newUserData.id = user.id;

    actions.editUser(newUserData);
  };

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCloseClick = () => {
    // const { closeSettings } = this.props;
    // closeSettings();
  };

  onBtnAcceptClick = () => {
    let userData = {};
    try {
      for (let key in this.state.userSettings) {
        userData[key] = this.state.userSettings[key];
      }
    } catch (e) {
      alert('ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ' + e.message);
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
      <div className="userSettingsContainer">
        {editFieldsPanel}
        {user !== undefined && (
          <div className="buttonsSet">
            <button className="buttonAccept" onClick={this.onBtnAcceptClick}>
              Применить
            </button>
            <button className="buttonClose" onClick={this.onBtnCloseClick}>
              Закрыть
            </button>
          </div>
        )}
      </div>
    );
  }
}

//for redux:
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
