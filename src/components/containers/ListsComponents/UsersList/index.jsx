import * as React from "react";
// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, deleteUser, editUser } from "../../../../actions/index";
// components:
import UserButtonedItem from "../UserButtonedItem/index";
import "./styles.css";



class UsersList extends React.Component {
  
  onUserEditClick = (id) => {
    console.log('пока не реализовано');
  
  }

  onUserDeleteClick = () => {
    console.log('пока не реализовано');

  }

  render() {
    
    const loadUsers = this.props.users.map((user, i) => {
      return (
        <li key={i}>
          <UserButtonedItem 
            user={user} 
            isSelected={false}
            onEditClick={this.onUserEditClick}
            onDeleteClick={this.onUserDeleteClick}
          />
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
