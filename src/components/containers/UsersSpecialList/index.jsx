import * as React from "react";
import UserSpecialItem from "../UserSpecialItem/index";
import {DebounceInput} from 'react-debounce-input';
import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, editUser, deleteUser } from "../../../actions/index";


class UsersSpecialList extends React.Component {

  state = {
    searchPhrase: ''
  }

  onChangeInput = (e) => {
    this.setState({
      searchPhrase: e.target.value
    });
  }

  render() {
    
    const neededUsers = this.props.users.filter((user) => {
      let formattedUser = user.title.toLowerCase().split(' ', 2);
      let formattedSPhrase = this.state.searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase)); 
    });

    const loadUsers = neededUsers.map((user, i) => {
      return (
        <li key={i}>
          <UserSpecialItem user={user} />
        </li>
      );
    });

    return (
      <div className={this.props.className}>
        <DebounceInput 
          minLength={1}
          debounceTimeout={300}
          onChange={this.onChangeInput}
        /> 
        <button className="stretchedButton">Add user</button>
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
