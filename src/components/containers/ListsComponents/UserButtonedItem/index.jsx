import * as React from 'react';
import iconPaths from '../../../../res/iconPaths';
import AdvancedSVG from '../../../presentational/AdvancedSVG/index';
import './styles.css';
import DeleteUserModal from '../../Modals/DeleteUserModal/index';

class UserButtonedItem extends React.Component {
  // работа с модальным окном:
  state = {
    showModal: false
  }

  openModal = () => {
    this.setState({
      showModal: true
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false
    });
  }

  handleYesClickModal = () => {
    // если щелкнули - да, то удаляем пользователя:
    const { user, onDeleteClick } = this.props;
    
    onDeleteClick(user.id);  
    this.closeModal();
  };
  
  handleCloseModal = () => {
    this.closeModal();
  };

  // handlers:
  handleUserSpecialItemClick = () => {
    const { user, onEditClick, isSelected } = this.props;
    if (!isSelected) {
      onEditClick(user.id);
    } else {
      onEditClick('');
    }
  }

  handleUserDeleteClick = () => {
    const { itemPlace, user, onDeleteClick } = this.props;
    // если у нас данный компонент находится во вкладке "Редактировать" (CurrentObjectTab),
    // то для него подтверждение выводить не надо
    // он не удаляет пользователя, а отвязывает от стола:
    if (itemPlace === 'CurrentObjectTab') {
      onDeleteClick(user.id);  
    } 
    // а если это вкладка "Пользователи" (Users),
    // то сначала спрашиваем подтверждение:
    if (itemPlace === 'UsersEditList') {
      this.openModal(); 
    }
  }

  handleIconClick = () => {
    const { user, onItemClick } = this.props;
    onItemClick(user.id);
  }

  render() {
    const { user, isSelected } = this.props;
    const { showModal } = this.state;

    return (
      <div className={isSelected ? 'selectedUserButtonedItem' : 'userButtonedItem'}>
        <AdvancedSVG
          width="30px"
          fill={['#E7ECED', /* '#556080' */ '#F9BF05']}
          content={iconPaths.user}
          onClick={this.handleIconClick}
        />
        <div className="userInfo">
          <div>{user.title}</div>
          <div>{user.capability}</div>
        </div>
        <AdvancedSVG width="20px" content={iconPaths.edit} onClick={this.handleUserSpecialItemClick} />
        <AdvancedSVG width="20px" content={iconPaths.delete} onClick={this.handleUserDeleteClick} />
        {/* Модальное окно для подтверждения удаления пользователя */}
        <DeleteUserModal
          visible={showModal}
          title={user.title}
          onYesClick={this.handleYesClickModal}
          onHide={this.handleCloseModal}
        />
      </div>
    );
  }
}

export default UserButtonedItem;
