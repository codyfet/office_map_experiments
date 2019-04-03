import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addUser,
  deleteUser,
  editUser,
  updateUser,
  changeCurrentObject,
  changeCurrentUser,
} from '../../../../actions/index';
import UserButtonedItem from '../UserButtonedItem/index';
import UserSettings from '../../UserSettings/index';
import UserCreate from '../../UserCreate/index';
import './styles.css';


class UsersEditList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      userId: '',
      showUserCreatePanel: false,
    };
  }

  getNewDefaultUser = () => {
    // получить текущую дату:
    let newStartDate = new Date().toLocaleDateString();
    newStartDate = newStartDate.split('/');
    newStartDate = newStartDate.slice(2).concat(newStartDate.slice(0, 2));
    newStartDate = newStartDate.join('-');

    // получить новый id для пользователя:
    const { users } = this.props;
    const lastId = users.reduce((prevVal, nextVal, i) => {
      let prevId;
      let nextId;
      if (i === 1) {
        prevId = Number(prevVal.id.slice(1));
        nextId = Number(nextVal.id.slice(1));
      } else {
        prevId = prevVal;
        nextId = Number(nextVal.id.slice(1));
      }

      return nextId > prevId ? nextId : prevId;
    });
    const newId = `t${String(lastId + 1).padStart(4, '0')}`;

    return {
      id: newId,
      category: 'people',
      enterpriseId: 'name.surname',
      title: 'Имя Фамилия',
      about: 'навыки',
      capability: 'квалификация',
      phone: '88005553535',
      level: 13,
      startdate: newStartDate,
      projectId: ''
    };
  };

  onChangeInput = e => {
    this.setState({
      searchPhrase: e.target.value,
    });
  };

  onItemClick = (newId) => {
    const { mapState, actions, objects } = this.props;
    // ищем объект с пользователем по объектам всех уровней:
    for (let lvl = 0; lvl < objects.levels.length; lvl += 1) {
      for (let obj of objects.levels[lvl]) {
        if (obj.userId === newId) { // если мы нашли объект:
          if (lvl === objects.mapLevel) { // он с нашего уровня:
            actions.changeCurrentObject(obj.id);
            actions.changeCurrentUser(obj.userId);
          } else {
            alert(`ПРЕДУПРЕЖДЕНИЕ: ПОЛЬЗОВАТЕЛЬ НА ДРУГОЙ КАРТЕ: ${mapState.description[lvl].title}`);
          }
          return;
        }
      }
    }

    alert('ПРЕДУПРЕЖДЕНИЕ: Пользователь не привязан к столу');
  }

  onUserClick = (newId) => {
    const { userId } = this.state;
    
    this.setState({
      userId: userId === '' ? newId : '',
      searchPhrase: '',
    });
  };

  onBtnAddUser = () => {
    // добавить нового пользователя:
    this.setState({
      showUserCreatePanel: true,
    });
  };

  onCloseUserCreatePanel = () => {
    this.setState({
      showUserCreatePanel: false,
    });
  };

  onDeleteUserClick = userId => {
    // сначала отвяжем пользователя от стола, чтобы не было проблем:
    const { actions, objects } = this.props;
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const loadObject = thisLevelObjects.find(elem => elem.userId === userId);

    if (loadObject !== undefined) {
      // если нашли стол, к которому привязан пользователь
      const emptyUserId = '';
      const newObjData = {
        id: loadObject.id,
        userId: emptyUserId,
      };
      actions.updateUser(newObjData);
    } // иначе - все в порядке, ничего не делаем

    // удалим пользователя:
    actions.deleteUser(userId);
  };

  render() {
    const { users } = this.props;
    const { userId, searchPhrase, showUserCreatePanel } = this.state;

    const neededUsers = users.filter(user => {
      const formattedUser = user.title.toLowerCase().split(' ', 2);
      const formattedSPhrase = searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase));
    });

    const loadUsers = neededUsers.map((user) => {
      if (userId === '') {
        // если пользователя не выбрали
        return (
          <li key={user.id}>
            <UserButtonedItem
              itemPlace="UsersEditList"
              user={user}
              isSelected={false}
              onItemClick={this.onItemClick}
              onEditClick={this.onUserClick}
              onDeleteClick={this.onDeleteUserClick}
            />
          </li>
        );
      } else if (userId === user.id) {
        // иначе
        return (
          <li key={user.id}>
            <UserButtonedItem
              itemPlace="UsersEditList"
              user={user}
              isSelected
              onItemClick={this.onItemClick}
              onEditClick={this.onUserClick}
              onDeleteUserClick={this.onDeleteUserClick}
            />
            <UserSettings user={user} onClose={this.onUserClick} />
          </li>
        );
      } else {
        return undefined;
      }
    });

    return (
      <div className="usersEditListWrapper">
        <DebounceInput minLength={1} debounceTimeout={300} onChange={this.onChangeInput} />
        <button type="submit" className="buttonAddUser" onClick={this.onBtnAddUser}>
          Добавить пользователя
        </button>
        {showUserCreatePanel && (
          <UserCreate user={this.getNewDefaultUser()} onClose={this.onCloseUserCreatePanel} />
        )}
        {!showUserCreatePanel && (
          <ul className={userId === '' ? 'usersEditListList' : 'usersEditListChosen'}>
            {loadUsers}
          </ul>
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  currentObject: state.currentObject,
  users: state.users,
  objects: state.objects,
  mapState: state.mapState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { addUser, editUser, deleteUser, updateUser, changeCurrentObject, changeCurrentUser },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersEditList);
