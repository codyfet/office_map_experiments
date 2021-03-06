import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser, changeCurrentUser, changeAnyObjectData } from '../../../actions/index';

import EditField from '../EditField/index';
import CheckboxField from '../CheckboxField/index';
import DropdownObjectField from '../DropdownObjectField/index';
import DropdownSeatLocationField from '../DropdownSeatLocationField';
import DropdownDoorLocationField from '../DropdownDoorLocationField';
import DropdownOrientationField from '../DropdownOrientationField';
import EditPositionField from '../EditPositionField';
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

  onInputChange = (settings) => {
    const { objectSettings } = this.state;
    let newObjectSettings = { ...objectSettings, ...settings };

    this.setState({
      objectSettings: newObjectSettings,
    });
  };

  sendChangedDataToRedux = (objectData) => {
    const { currentObject, actions } = this.props;
    const id = currentObject.objectId;
    const newObjectData = { ...objectData, id };

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

    // определим свойства, которые можно редактировать    
    const allowedProperties = [
      'id',
      'isCompound',
      'coordinates',
      'title',
      'category',
      'seatLocation',
      'orientation',
      'doorLocation',
      'doorPosition',
      'iconPosition',
      'width',
      'height',
      'color',
      'movable',
      'about',
      'fullInfo'
    ];
    const editFieldsPanel = allowedProperties.map((prop) => {
      if (object === undefined) {
        return undefined;
      }

      if (prop === 'seatLocation' && object.category !== 'table') {
        return undefined;
      }

      if (prop === 'orientation'
          && !['cupboard', 'printer', 'scaner', 'shredder'].includes(object.category)) {
        return undefined;
      }

      if ((prop === 'doorLocation' || prop === 'doorPosition')
          && !['meeting_room', 'public_place', 'service_room'].includes(object.category)) {
        return undefined;
      }

      if (prop === 'title' && object.category === 'table') {
        return undefined;
      }

      if ((prop === 'width' || prop === 'height') && object.isCompound) {
        return undefined;
      } 

      if (prop === 'iconPosition' && !object.isCompound) {
        return undefined;
      } 

      if (['about', 'fullInfo'].includes(prop) && ['table', 'construction'].includes(object.category)) {
        return undefined;
      }

      // Добавляем поля редактирования:
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
      } else if (prop === 'seatLocation') {
        return (
          <DropdownSeatLocationField
            key={prop}
            label={prop}
            placeholder={object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'orientation') {
        return (
          <DropdownOrientationField
            key={prop}
            label={prop}
            placeholder={object[prop] !== undefined ? object[prop] : object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'doorLocation') {
        return (
          <DropdownDoorLocationField
            key={prop}
            label={prop}
            placeholder={object[prop] !== undefined ? object[prop] : object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === 'doorPosition') {
        return (
          <EditPositionField
            key={prop}
            label={prop}
            placeholder={`${object[prop].x},${object[prop].y}`}
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
      } else if (prop === 'iconPosition' && object.isCompound) {
        return (
          <EditPositionField
            key={prop}
            label={prop}
            placeholder={`${object[prop].x},${object[prop].y}`}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else {
        return (
          <EditField
            key={prop}
            label={prop}
            placeholder={String(object[prop])}
            disabled={prop === 'id' || prop === 'isCompound'}
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
