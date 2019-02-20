import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import ChooseUserList from '../ListsComponents/ChooseUserList/index';
import ObjectsList from '../ListsComponents/ObjectsList/index';
import './styles.css';
import createMapObject from '../../../utils/objectsFactory';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject } from '../../../actions/index';

// для генерирования уникальных id:
var genUniqId = require('uniqid');

class CreateTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedObjectId: '',
      selectedUserId: '',
    };
  }

  getConvertedCoordsFrom(x, y) {
    const { shift, scale } = this.props.boardState;

    return {
      x: (x - shift[0]) / scale,
      y: (y - shift[1]) / scale,
    };
  }

  checkUserAssignedToTable(userId) {
    // если пользователя нет, то проверять ничего не надо:
    if (userId === '') {
      return false;
    }

    // иначе ищем пользователя по объектам всех уровней:
    const { objects } = this.props;
    for (let lvl of objects.levels) {
      for (let obj of lvl) {
        if (obj.userId === userId) {
          return true;
        }
      }
    }
    return false;
  }

  // ОБРАБОТЧИКИ:
  onSubmitClick = () => {
    const { actions } = this.props;
    const { selectedObjectId, selectedUserId } = this.state;

    // Проверки на ошибки:
    if (selectedObjectId === '') {
      alert('ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Выберите объект!');
      return;
    } else if (selectedObjectId === 'table') {
      if (this.checkUserAssignedToTable(selectedUserId)) {
        alert('ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!');
        return;
      }
    }

    // console.log('convertCoords', this.getConvertedCoordsFrom(750, 20));

    const newObject = createMapObject(
      selectedObjectId,
      genUniqId(),
      this.getConvertedCoordsFrom(750, 20),
      selectedUserId,
    );

    // console.log('newObject', newObject);
    actions.createObject(newObject);

    // сбросить выбор:
    this.fullResetIDs();
  };

  // ИЗМЕНЕНИЕ СОСТОЯНИЯ CREATE_TAB:
  selectObjectId = id => {
    this.setState({
      selectedObjectId: id,
    });
    // console.log('selectedObjectId', id);
  };

  selectUserId = id => {
    this.setState({
      selectedUserId: id,
    });
    // console.log('selectedUserId', id);
  };

  fullResetIDs = () => {
    this.setState({
      selectedObjectId: '',
      selectedUserId: '',
    });
  };

  render() {
    const { selectedObjectId } = this.state;

    return (
      <React.Fragment>
        <Accordion className="create-tab-accordion" allowMultiple="true">
          <AccordionItem
            bodyClassName="create-tab-accordion-item-body-wrapper"
            expandedClassName="create-tab-accordion-item-expanded"
            titleClassName="create-tab-accordion-item-title"
            title="Выберите объект"
            expanded="true"
            duration={400}
          >
            <ObjectsList
              objectId={this.state.selectedObjectId}
              onObjectClick={this.selectObjectId}
            />
          </AccordionItem>

          <AccordionItem
            bodyClassName="create-tab-accordion-item-body-wrapper"
            expandedClassName="create-tab-accordion-item-expanded"
            titleClassName="create-tab-accordion-item-title"
            title="Выберите пользователя"
            expanded={selectedObjectId === 'table'}
            duration={400}
          >
            {selectedObjectId === 'table' && (
              <ChooseUserList userId={this.state.selectedUserId} onUserClick={this.selectUserId} />
            )}
            {selectedObjectId !== 'table' && selectedObjectId !== '' && (
              <div>
                <p className="chooseUserText">К этому объекту нельзя добавить пользователя!</p>
              </div>
            )}
            {selectedObjectId === '' && (
              <div>
                <p className="chooseUserText">Чтобы выбрать пользователя - выберите объект!</p>
              </div>
            )}
          </AccordionItem>
        </Accordion>
        <button style={{ width: '100%' }} onClick={this.onSubmitClick}>
          Создать
        </button>
      </React.Fragment>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  boardState: state.boardState,
  objects: state.objects,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ createObject }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTab);
