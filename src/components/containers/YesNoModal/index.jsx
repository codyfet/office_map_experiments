import React from 'react';
// import { Modal, Button } from 'react-bootstrap';
import Modal from 'react-awesome-modal';
import './styles.css';

class YesNoModal extends React.Component {
  handleYesClick = () => {
    const { onYesClick } = this.props;
    onYesClick();
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
  };

  countObjects(objectIds) {
    return objectIds.split(' ').length;
  }

  constructModalMessage(objectIds) {
    let objectsAmount = this.countObjects(objectIds);
    if (objectsAmount === 1) {
      return 'Вы уверены что хотите удалить этот объект?';
    } else if (objectsAmount > 1 && objectsAmount <= 4) {
      return `Вы уверены что хотите удалить эти ${objectsAmount} объекта?`;
    } else { // if (objectsAmount > 4)
      return `Вы уверены что хотите удалить эти ${objectsAmount} объектов?`;
    }
  }

  render() {
    const { visible, objectIds } = this.props;
    const message = this.constructModalMessage(objectIds);

    return (
      <Modal 
        visible={visible}
        width="450"
        height="100"
        effect="fadeInUp"
        onClickAway={this.handleClose}
      >
        <div className="yesNoModalContainer">
          <h1 className="yesNoModalLabel">Подтверждение действия</h1>
          <p className="yesNoModalMessage">{message}</p>
          <div className="buttonsSet">
            <button className="buttonAccept" type="submit" onClick={this.handleYesClick}>Да</button>
            <button className="buttonClose" type="submit" onClick={this.handleClose}>Нет</button>
          </div>
        </div>
      </Modal>
      
    );
  }
}

export default YesNoModal;