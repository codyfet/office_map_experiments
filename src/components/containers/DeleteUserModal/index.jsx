import React from 'react';
// import { Modal, Button } from 'react-bootstrap';
import Modal from 'react-awesome-modal';
import './styles.css';

class DeleteUserModal extends React.Component {
  handleYesClick = () => {
    const { onYesClick } = this.props;
    onYesClick();
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
  };

  render() {
    const { visible, title } = this.props;

    return (
      <Modal 
        visible={visible}
        width="450"
        height="150"
        effect="fadeInUp"
        onClickAway={this.handleClose}
      >
        <div className="deleteUserModalContainer">
          <h1 className="deleteUserModalLabel">Подтверждение действия</h1>
          <p className="deleteUserModalMessage">Вы уверены, что хотите удалить пользователя: {title}?</p>
          <div className="modalButtonsSet">
            <button className="modalButtonAccept" type="submit" onClick={this.handleYesClick}>Да</button>
            <button className="modalButtonClose" type="submit" onClick={this.handleClose}>Нет</button>
          </div>
        </div>
      </Modal>
      
    );
  }
}

export default DeleteUserModal;