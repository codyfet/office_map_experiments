import * as React from "react";
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, deleteUser, editUser, updateUser } from "../../../../actions/index";
import UserButtonedItem from "../UserButtonedItem/index";
import UserSettings from "../../UserSettings/index";
import UserCreate from "../../UserCreate/index";
import "./styles.css";



class UsersEditList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      userId: '',
      showUserCreatePanel: false
    }
  }

  getNewDefaultUser = () => {
    // получить текущую дату:
    let newStartDate = new Date().toLocaleDateString();
    newStartDate = newStartDate.split('/');
    newStartDate = newStartDate.slice(2).concat(newStartDate.slice(0,2));
    newStartDate = newStartDate.join('-');

    // получить новый id для пользователя:
    const { users } = this.props;
    let lastId = users.reduce( (prevVal, nextVal, i) => {
      console.log('reduce', i, prevVal, nextVal);
      let prevId, nextId;
      if (i === 1) {
        prevId = Number(prevVal.id.slice(1));
        nextId = Number(nextVal.id.slice(1));  
      } else {
        prevId = prevVal;
        nextId = Number(nextVal.id.slice(1));
      }
      console.log('reduce', prevId, nextId);
      return nextId > prevId ? nextId : prevId; 
    });
    let newId = "t" + String(lastId + 1).padStart(4, "0");

    return {
      id: newId,
      category: "people",
      userId: "name.surname",
      title: "Имя Фамилия",
      about: "навыки",
      capability: "квалификация",
      phone: "88005553535",
      level: 13,
      startdate: newStartDate
    };
  }

  onChangeInput = (e) => {
    this.setState({
      searchPhrase: e.target.value
    });
  }

  onUserClick = (newId) => {
    // если пользователь выбран, то мы ещё и обнуляем фразу для поиска:
    this.setState({
        userId: this.state.userId === '' ? newId : '',
        searchPhrase: ''  
    });

  }

  onBtnAddUser = () => {
    // добавить нового пользователя:
    this.setState({
      showUserCreatePanel: true
    });
  }

  onCloseUserCreatePanel = () => {
    this.setState({
      showUserCreatePanel: false
    });
  }

  onDeleteUserClick = (userId) => {
    // сначала отвяжем пользователя от стола, чтобы не было проблем:
    const { actions, objects } = this.props;
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const loadObject = thisLevelObjects.find((elem) => (elem.userId === userId));

    if (loadObject !== undefined) { // если нашли стол, к которому привязан пользователь
      const emptyUserId = "";
      const newObjData = {
        id: loadObject.id,
        userId: emptyUserId
      };
      actions.updateUser(newObjData);
      
    } // иначе - все в порядке, ничего не делаем
   
    // удалим пользователя:
    actions.deleteUser(userId);

  }

  render() {
    const { userId } = this.state;

    const neededUsers = this.props.users.filter((user) => {
      let formattedUser = user.title.toLowerCase().split(' ', 2);
      let formattedSPhrase = this.state.searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase)); 
    });

    const loadUsers = neededUsers.map((user, i) => {
      if ( userId === '' ) { //если пользователя не выбрали
        return (
          <li key={i}>
            <UserButtonedItem 
              user={user}
              isSelected={false} 
              onEditClick={this.onUserClick}
              onDeleteClick={this.onDeleteUserClick}
            />
          </li>
        );
      } else if ( userId === user.id ) { //иначе
        return (
          <li key={i}>
            <UserButtonedItem 
              user={user} 
              isSelected={true}
              onEditClick={this.onUserClick}
              onDeleteUserClick={this.onDeleteUserClick}
            />
            <UserSettings 
              user={user}
              onClose={this.onUserClick}    
            />
          </li>
        );
      } else {
        return;
      }
      
    });

    return (
      <div 
        className="usersEditListWrapper"
      >
        <DebounceInput 
            minLength={1}
            debounceTimeout={300}
            onChange={this.onChangeInput}
        />
        <button 
          className="buttonAddUser"
          onClick={this.onBtnAddUser}
        >
          Добавить пользователя
        </button>
        {
          this.state.showUserCreatePanel === true && 
          <UserCreate 
              user={this.getNewDefaultUser()}
              onClose={this.onCloseUserCreatePanel}    
          />
        }
        {
          this.state.showUserCreatePanel === false &&
          <ul 
            className={ userId === '' ? "usersEditListList" : "usersEditListChosen" }
          >   
            {loadUsers}
          </ul>  
        }
        
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  users: state.users,
  objects: state.objects

});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addUser, editUser, deleteUser, updateUser }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersEditList);
