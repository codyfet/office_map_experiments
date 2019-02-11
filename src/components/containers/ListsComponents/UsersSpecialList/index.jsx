import * as React from "react";
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, deleteUser, editUser } from "../../../../actions/index";
import UserSimpleItem from "../UserSimpleItem/index";
import "./styles.css";

// компонент реализован специально для CurrentObjectTab:
// для выбора нового пользователя для текущего объекта:

class UsersSpecialList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      selectedUserId: ''
    }
  }

  onChangeInput = (e) => {
    this.setState({
      searchPhrase: e.target.value
    });
  }

  selectUserId = (id) => {
    // если пользователь выбран, то мы ещё и обнуляем фразу для поиска:
    this.setState({
      selectedUserId: this.state.selectedUserId === '' ? id : '',
      searchPhrase: this.state.selectedUserId === '' ? this.state.searchPhrase : ''
    });

    // передаём информацию в SidePanel:
    const { onUserClick } = this.props;
    onUserClick(id);
  }

  render() {
    
    const neededUsers = this.props.users.filter((user) => {
      let formattedUser = user.title.toLowerCase().split(' ', 2);
      let formattedSPhrase = this.state.searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase)); 
    });

    const loadUsers = neededUsers.map((user, i) => {
      if ( this.state.selectedUserId === '' ) { //если пользователя не выбрали
        return (
          <li key={i}>
            <UserSimpleItem 
              user={user}
              isSelected={false} 
              onClick={this.selectUserId}
            />
          </li>
        );
      } else if ( this.state.selectedUserId === user.id ) { //иначе
        return (
          <li key={i}>
            <UserSimpleItem 
              user={user} 
              isSelected={true}
              onClick={this.selectUserId}
            />
          </li>
        );
      } else {
        return;
      }
      
    });

    return (
      <div 
        className="userSpecialListWrapper"
      >
        {
          this.state.selectedUserId === '' &&
          <DebounceInput 
            minLength={1}
            debounceTimeout={300}
            onChange={this.onChangeInput}
          /> 
        }
        {
          this.state.selectedUserId === '' &&
          <button className="stretchedButton">Добавить пользователя</button>
        }
        <ul className="userSpecialList">{loadUsers}</ul>
        
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
)(UsersSpecialList);
