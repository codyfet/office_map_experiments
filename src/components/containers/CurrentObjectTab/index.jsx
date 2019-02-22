import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser, changeCurrentUser } from '../../../actions/index';
import { SINGLE_EDIT } from '../../../res/workModeConstants';

import UserButtonedItem from '../ListsComponents/UserButtonedItem/index';
import UsersSpecialList from '../ListsComponents/UsersSpecialList/index';
import CurrentObjectItem from '../CurrentObjectItem/index';
import CurrentObjectSettings from '../CurrentObjectSettings/index';

import './styles.css';

// для создания копий:
const _ = require('lodash');

class CurrentObjectTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showObjectSettings: false,
      showChangeUserPanel: false,
    };
  }

  checkUserAssignedToTable(userId) {
    // если пользователя нет, то проверять ничего не надо:
    if (userId === '') {
      return false;
    }

    // иначе ищем пользователя по объектам всех уровней:
    const { objects } = this.props;
    for (let lvl of objects.levels) {
      for (let obj of lvl) {
        if (obj.userId === userId) {
          return true;
        }
      }
    }
    return false;
  }

  // select object:
  openCloseObjectSettings = () => {
    const { showObjectSettings } = this.state;
    this.setState({
      showObjectSettings: !showObjectSettings,
    });
  };

  // open object settings panel:
  closeObjectSettings = () => {
    this.setState({
      showObjectSettings: false,
    });
  };

  // open changing user panel:
  openChangeUserPanel = (id) => {
    const { currentObject } = this.props;
    if (currentObject.objectId === '') {
      alert('ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Щелкните на одном из объектов!');
    } else {
      const { showChangeUserPanel } = this.state;
      this.setState({
        showChangeUserPanel: !showChangeUserPanel,
      });
    }
  };

  // select user:
  selectUser = (newUserId) => {
    const { actions, currentObject } = this.props;

    if (currentObject.userId === newUserId) {
      // если выбрали того же пользователя
      alert('ПРЕДУПРЕЖДЕНИЕ: ВЫ ВЫБРАЛИ ТОГО ЖЕ ПОЛЬЗОВАТЕЛЯ. LOL=) А зачем?)');
    } else if (this.checkUserAssignedToTable(newUserId)) {
      alert('ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!');
    } else {
      const newObjData = {
        id: currentObject.objectId,
        userId: newUserId,
      };
      actions.updateUser(newObjData);
      actions.changeCurrentUser(newUserId);
    }

    const { showChangeUserPanel } = this.state;
    this.setState({
      showChangeUserPanel: !showChangeUserPanel,
    });
  };

  onDeleteUser = () => {
    const { actions, currentObject } = this.props;
    const emptyUserId = '';
    const newObjData = {
      id: currentObject.objectId,
      userId: emptyUserId,
    };
    actions.updateUser(newObjData);
    actions.changeCurrentUser(emptyUserId);

    this.setState({
      showChangeUserPanel: false,
    });
  };

  render() {
    const { currentObject, workMode, objects, users } = this.props;
    const { showChangeUserPanel } = this.state;
    
    let requiredObject;
    let requiredUser = {
      title: 'Not assigned',
      capability: '',
    };

    if (workMode === SINGLE_EDIT) {
      // вынуть объекты текущего уровня:
      const thisLevelObjects = objects.levels[objects.mapLevel];

      requiredObject = thisLevelObjects.find(val => val.id === currentObject.objectId);
      if (requiredObject !== undefined) {
        // объект определен

        if (currentObject.userId !== undefined && currentObject.userId !== '') {
          // к объекту привязан пользователь
          requiredUser = users.find(val => val.id === currentObject.userId);
        }
      } // иначе - либо объект не определен, либо к нему не привязан пользователь

      // нам нужны только immutable: делаем копии:
      requiredObject = _.cloneDeep(requiredObject);
      requiredUser = _.cloneDeep(requiredUser);
    }

    return (
      <div>
        <div className="currentObjectContainer">
          <div className="labelCurrObj">
            Изменить выбранный объект #ID: {currentObject.objectId}
          </div>
          <CurrentObjectItem
            object={requiredObject}
            // onClick={this.openCloseObjectSettings}
          />
          <CurrentObjectSettings object={requiredObject} closeSettings={this.closeObjectSettings} />
        </div>
        {/* Пользователь показывается только если текущий объект - стол: */
        requiredObject !== undefined && requiredObject.category === 'table' && (
          <div className="currentObjectContainer">
            <div className="labelCurrObj">Изменить пользователя:</div>
            <UserButtonedItem
              user={requiredUser}
              isSelected={false}
              onItemClick={this.openChangeUserPanel}
              onEditClick={this.openChangeUserPanel}
              onDeleteClick={this.onDeleteUser}
            />
          </div>
        )}
        {showChangeUserPanel && <UsersSpecialList onUserClick={this.selectUser} />}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  users: state.users,
  currentObject: state.currentObject,
  workMode: state.workMode,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser, changeCurrentUser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentObjectTab);
