import React from 'react';
// import { Modal, Button } from 'react-bootstrap';
import Modal from 'react-awesome-modal';
import './styles.css';
import ObjectsList from '../../ListsComponents/ObjectsList/index';

class MergeObjectsModal extends React.Component {
  state = {
    selectedObjectId: ''
  }

  selectObjectId = (id) => {
    this.setState({
      selectedObjectId: id,
    }); 
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
  };

  handleConfirm = () => {
    const { onConfirmClick } = this.props;
    const { selectedObjectId } = this.state;
    onConfirmClick(selectedObjectId);
  };

  render() {
    const { visible } = this.props;
    const { selectedObjectId } = this.state;

    return (
      <Modal 
        visible={visible}
        width="450"
        height="220"
        effect="fadeInUp"
        onClickAway={this.handleClose}
      >
        <div className="mergeObjectsModalContainer">
          <h1 className="mergeObjectsModalLabel">Объединение объектов</h1>
          <p className="mergeObjectsModalMessage">Выберите финальный тип объекта</p>
          <ObjectsList 
            objectId={selectedObjectId}
            onObjectClick={this.selectObjectId}
          />
          <div className="modalButtonsSet">
            <button className="modalButtonAccept" type="submit" onClick={this.handleConfirm}>Подтвердить выбор</button>
            <button className="modalButtonClose" type="submit" onClick={this.handleClose}>Отмена</button>
          </div>
        </div>
      </Modal>
      
    );
  }
}

export default MergeObjectsModal;