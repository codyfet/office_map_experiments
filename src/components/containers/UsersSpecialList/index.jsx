import * as React from "react";
import UserSpecialItem from "../UserSpecialItem/index";
import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUser, editUser, deleteUser } from "../../../actions/index";

class UsersSpecialList extends React.Component {
  
  handleInputChange() {

  }

  render() {
    
    const loadUsers = this.props.users.map((user, i) => {
      return (
        <li key={i}>
          <UserSpecialItem user={user} />
        </li>
      );
    });

    return (
      <div className="userSpecialListWrapper">
        <input className="inputUsersSpecial" type="text" />
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
