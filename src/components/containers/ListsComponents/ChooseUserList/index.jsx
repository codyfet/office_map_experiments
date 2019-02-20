import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser, deleteUser, editUser } from '../../../../actions/index';
import UserSimpleItem from '../UserSimpleItem/index';
import './styles.css';

class ChooseUserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
    };
  }

  onChangeInput = e => {
    this.setState({
      searchPhrase: e.target.value,
    });
  };

  onUserClick = id => {
    const { userId, onUserClick } = this.props;
    // если пользователь выбран, то мы ещё и обнуляем фразу для поиска:
    if (userId === '') {
      // передаем информацию в CreateTab:
      onUserClick(id);
      this.setState({
        searchPhrase: '',
      });
    } else {
      onUserClick('');
    }
  };

  render() {
    const { userId } = this.props;

    const neededUsers = this.props.users.filter(user => {
      let formattedUser = user.title.toLowerCase().split(' ', 2);
      let formattedSPhrase = this.state.searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase));
    });

    const loadUsers = neededUsers.map((user, i) => {
      if (userId === '') {
        //если пользователя не выбрали
        return (
          <li key={i}>
            <UserSimpleItem user={user} isSelected={false} onClick={this.onUserClick} />
          </li>
        );
      } else if (userId === user.id) {
        //иначе
        return (
          <li key={i}>
            <UserSimpleItem user={user} isSelected={true} onClick={this.onUserClick} />
          </li>
        );
      } else {
        return;
      }
    });

    return (
      <div className="chooseUserListWrapper">
        {userId === '' && (
          <DebounceInput minLength={1} debounceTimeout={300} onChange={this.onChangeInput} />
        )}
        <ul className={userId === '' ? 'chooseUserList' : 'chooseUserListChosen'}>{loadUsers}</ul>
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addUser, editUser, deleteUser }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseUserList);
