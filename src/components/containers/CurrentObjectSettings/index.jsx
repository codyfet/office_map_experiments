import * as React from "react";
import EditField from "../../containers/EditField/index";

import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser, changeCurrentUser, changeAnyObjectData } from "../../../actions/index";

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';

class CurrentObjectSettings extends React.Component {

  state = {
    objectSettings: {}
  }

  onInputChange = (settings) => {
    let newObjectSettings = Object.assign({}, this.state.objectSettings);
    newObjectSettings = Object.assign(newObjectSettings, settings);

    this.setState({
      objectSettings: newObjectSettings
    },
    () => { console.log('objSettings', this.state.objectSettings) });

  }

  sendChangedDataToRedux = (objectData) => {
    const { currentObject, actions } = this.props;
    let newObjectData = Object.assign({}, objectData);
    newObjectData.id = currentObject.objectId;

    actions.changeAnyObjectData(newObjectData);

  }

  // ОБРАБОТЧИКИ КНОПОК:
  onBtnCloseClick = () => {
    const { closeSettings } = this.props;
    closeSettings();

  }

  onBtnAcceptClick = () => {
    // сначала нужно преобразовать всё к соответствующим типам данных:
    // category - string
    // coordinates, width, height - numbers
    // movable - boolean
    let objectData = {};
    try {
      for ( let key in this.state.objectSettings ) {
        if ( key === "category" ) {
          // есть ли такая категория:
          if ( objectCategories.find( cat => cat.id === this.state.objectSettings[key]) ) {
            objectData[key] = this.state.objectSettings[key];
          } else {
            throw new Error('Неправильная категория');
          }
        } else if ( key === "movable" ) {
          if ( this.state.objectSettings[key] === "true" ) {
            objectData[key] = true;
          } else if ( this.state.objectSettings[key] === "false" ) {
            objectData[key] = false;
          } else {
            throw new Error("Булевское значение введено неверно");
          }
        
        } else if ( key === "coordinates (x,y)" ){
          // проверяем, корректно ли указаны координаты:
          let regExp = /^(\d+)[,](\d+)\s*$/;
          if ( regExp.test(this.state.objectSettings[key]) ) {
            let xyData = regExp.exec(this.state.objectSettings[key])
            objectData.coordinates = {
              x: Number(xyData[1]),
              y: Number(xyData[2])
            };

          } else { // если некорректно
            throw new Error("Неправильно введены координаты");
          }
        } else if ( key !== "title" ) {
          // остался только тип "номер":
          if ( /^\d*$/.test(this.state.objectSettings[key]) ) {
            objectData[key] = Number(this.state.objectSettings[key]);
          } else {
            throw new Error("Исправьте ввод числовых значений");
          }
          
        }
        // заметим, что key === title преобразовывать не нужно - это строка
      }
    } 
    catch(e) {
      alert("ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: " + e.message);
      return;
    }

    console.log('objDat', objectData);
    this.sendChangedDataToRedux(objectData);
    
  }

  render() {
    const { object } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      "id",
      "category",
      "title",
      "coordinates",
      "width",
      "height",
      "color",
      "movable"
    ];
    const editFieldsPanel = allowedProperties.map((prop, i) => {
      if ( object[prop] === undefined ) {
        return;
      } 

      if (prop === "coordinates") {
        return (
          <EditField
            key={i}
            label="coordinates (x,y)"
            placeholder={String(object[prop].x) + ',' + String(object[prop].y)}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else {
        return (
          <EditField
            key={i}
            label={prop}
            placeholder={String(object[prop])}
            disabled={ prop === "id" }
            onInputChange={this.onInputChange}
          />
        );

      } 
     
    });

    

    return (
      <div className="currentObjectSettingsContainer">
        {editFieldsPanel}
        <div className="buttonsSet">
          <button 
            className="buttonAccept"
            onClick={this.onBtnAcceptClick}
          >
            Применить
          </button>
          <button
            className="buttonClose"
            onClick={this.onBtnCloseClick}
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }
}

//for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  currentObject: state.currentObject
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser, changeCurrentUser, changeAnyObjectData }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentObjectSettings);
