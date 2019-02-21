import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser, deleteUser, editUser } from '../../../../actions/index';
import UserSimpleItem from '../UserSimpleItem/index';
import './styles.css';

// компонент реализован специально для CurrentObjectTab:
// для выбора нового пользователя для текущего объекта:

class UsersSpecialList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      selectedUserId: '',
    };
  }

  onChangeInput = e => {
    this.setState({
      searchPhrase: e.target.value,
    });
  };

  selectUserId = id => {
    const { searchPhrase, selectedUserId } = this.state;

    // если пользователь выбран, то мы ещё и обнуляем фразу для поиска:
    this.setState({
      selectedUserId: selectedUserId === '' ? id : '',
      searchPhrase: selectedUserId === '' ? searchPhrase : '',
    });

    // передаём информацию в SidePanel:
    const { onUserClick } = this.props;
    onUserClick(id);
  };

  render() {
    const { users } = this.props;
    const { searchPhrase, selectedUserId } = this.state;

    const neededUsers = users.filter(user => {
      const formattedUser = user.title.toLowerCase().split(' ', 2);
      const formattedSPhrase = searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return formattedUser.some(val => val.startsWith(formattedSPhrase));
    });

    const loadUsers = neededUsers.map((user, i) => {
      if (selectedUserId === '') {
        // если пользователя не выбрали
        return (
          <li key={i}>
            <UserSimpleItem user={user} isSelected={false} onClick={this.selectUserId} />
          </li>
        );
      } else if (selectedUserId === user.id) {
        // иначе
        return (
          <li key={i}>
            <UserSimpleItem user={user} isSelected={true} onClick={this.selectUserId} />
          </li>
        );
      } else {
        return undefined;
      }
    });

    return (
      <div className="userSpecialListWrapper">
        {selectedUserId === '' && (
          <DebounceInput minLength={1} debounceTimeout={300} onChange={this.onChangeInput} />
        )}
        <ul className="userSpecialList">{loadUsers}</ul>
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
)(UsersSpecialList);
