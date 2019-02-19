import * as React from "react";
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, deleteUser, editUser } from "../../../../actions/index";
import UserButtonedItem from "../UserButtonedItem/index";
import UserSettings from "../../UserSettings/index";
import "./styles.css";


class UsersEditList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      userId: ''
    }
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

  }

  onDeleteUserClick = (userId) => {
    // удалить пользователя
    const { actions } = this.props;
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
          className="stretchedButton"
          onClick={this.onBtnAddUser}
        >
          Добавить пользователя
        </button>
        <ul 
            className={ userId === '' ? "usersEditListList" : "usersEditListChosen" }
        >
            {loadUsers}
        </ul>
        
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  users: state.users
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addUser, editUser, deleteUser }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersEditList);
