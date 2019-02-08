import * as React from "react";
// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, deleteUser, editUser } from "../../../../actions/index";
// components:
import UserItem from "../UserItem/index";
import "./styles.css";



class UsersList extends React.Component {
  
  render() {
    
    const loadUsers = this.props.users.map((user, i) => {
      return (
        <li key={i}>
          <UserItem user={user} />
        </li>
      );
    });

    return (
      <React.Fragment>
        <ul className="userList">{loadUsers}</ul>
        <button className="stretched">Добавить пользователя</button>
      </React.Fragment>
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
)(UsersList);
