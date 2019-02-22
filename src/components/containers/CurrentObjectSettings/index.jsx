import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser, changeCurrentUser, changeAnyObjectData } from '../../../actions/index';

import EditField from '../EditField/index';
import CheckboxField from '../CheckboxField/index';
import DropdownObjectField from '../DropdownObjectField/index';
import './styles.css';

class CurrentObjectSettings extends React.Component {
  state = {
    objectSettings: {},
  };

  componentWillUnmount() {
    // сбросить данные:
    this.setState({
      objectSettings: {},
    });
  }

  onInputChange = settings => {
    const { objectSettings } = this.state;
    let newObjectSettings = Object.assign({}, objectSettings);
    newObjectSettings = Object.assign(newObjectSettings, settings);

    this.setState({
      objectSettings: newObjectSettings,
    });
  };

  sendChangedDataToRedux = objectData => {
    const { currentObject, actions } = this.props;
    const newObjectData = Object.assign({}, objectData);
    newObjectData.id = currentObject.objectId;

    actions.changeAnyObjectData(newObjectData);
  };

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCloseClick = () => {
    const { closeSettings } = this.props;
    closeSettings();
  };

  onBtnAcceptClick = () => {
    const { objectSettings } = this.state;
    const objectData = {};
    try {
      Object.keys(objectSettings).forEach((key) => {
        if (key === 'width' || key === 'height') {
          // остался только тип "номер":
          if (/^\d*$/.test(objectSettings[key])) {
            objectData[key] = Number(objectSettings[key]);
          } else {
            throw new Error('Исправьте ввод числовых значений');
          }
        } else {
          // заметим, что title и color преобразовывать не нужно - это строки
          // также:
          // c DropdownObjectField категорию оюъекта невозможно ввести неверно
          // с checkbox булевское значение невозможно ввести неверно
          objectData[key] = objectSettings[key];
        }
      });

      this.sendChangedDataToRedux(objectData);

      // сбросить данные:
      this.setState({
        objectSettings: {},
      });
    } catch (e) {
      alert(`ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ${e.message}`);
    }
  };

  render() {
    const { object } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      'id',
      'coordinates',
      'title',
      'category',
      'width',
      'height',
      'color',
      'movable',
    ];
    const editFieldsPanel = allowedProperties.map((prop) => {
      if (object === undefined) {
        return undefined;
      }

      if (prop === 'movable') {
        return (
          <CheckboxField
            key={prop}
            label={prop}
            placeholder={object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'category') {
        return (
          <DropdownObjectField
            key={prop}
            label={prop}
            placeholder={object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'coordinates') {
        return (
          <EditField
            key={prop}
            label="coordinates (x,y)"
            placeholder={`${object[prop].x},${object[prop].y}`}
            disabled
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'title' && object.category === 'table') {
        return undefined;
      } else {
        return (
          <EditField
            key={prop}
            label={prop}
            placeholder={String(object[prop])}
            disabled={prop === 'id' || (prop === 'title' && object.category === 'table')}
            onInputChange={this.onInputChange}
          />
        );
      }
    });

    return (
      <div className="currentObjectSettingsContainer">
        {editFieldsPanel}
        {object !== undefined && (
          <div className="buttonsSet">
            <button type="submit" className="buttonCurrentObjectSettingsAccept" onClick={this.onBtnAcceptClick}>
              Применить
            </button>
          </div>
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  currentObject: state.currentObject,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser, changeCurrentUser, changeAnyObjectData }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentObjectSettings);
