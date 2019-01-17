import * as React from "react";
import UserItem from "../UserItem/index";
import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, editUser, deleteUser } from "../../../actions/index";

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
        <button className="stretched">Add user</button>
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
