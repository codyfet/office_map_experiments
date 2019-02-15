import * as React from "react";
import EditField from "../../containers/EditField/index";
import CheckboxField from "../../containers/CheckboxField/index";
import DropdownField from './../DropdownField/index';

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
    });

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
          // c DropdownField категорию оюъекта невозможно ввести неверно:
          objectData[key] = this.state.objectSettings[key];
          
        } else if ( key === "movable" ) {
          // с checkbox булевское значение невозможно ввести неверно:
          objectData[key] = this.state.objectSettings[key];
      
        } else if ( key !== "title" && key !== "color" ) {
          // остался только тип "номер":
          if ( /^\d*$/.test(this.state.objectSettings[key]) ) {
            objectData[key] = Number(this.state.objectSettings[key]);
          } else {
            throw new Error("Исправьте ввод числовых значений");
          }
        } else {
          // заметим, что title и color преобразовывать не нужно - это строки
          objectData[key] = this.state.objectSettings[key];
        }
        
      }
    } 
    catch(e) {
      alert("ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: " + e.message);
      return;
    }

    // console.log('objDat', objectData);
    this.sendChangedDataToRedux(objectData);
    
  }

  render() {
    const { object } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      "id",
      "coordinates",
      "title",
      "category",
      "width",
      "height",
      "color",
      "movable"
    ];
    const editFieldsPanel = allowedProperties.map((prop, i) => {
      if (prop === "movable") {
        return (
          <CheckboxField
            key={i}
            label={prop}
            placeholder={object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === "category") {
        return (
          <DropdownField
            key={i}
            label={prop}
            placeholder={object[prop]}
            disabled={false}
            onInputChange={this.onInputChange}
          />
        );
      } else if (prop === "coordinates") {
        return (
          <EditField
            key={i}
            label={"coordinates (x,y)"}
            placeholder={String(object[prop].x) + ',' + String(object[prop].y)}
            disabled={true}
            onInputChange={this.onInputChange}
          />
        );
      } else {
        return (
          <EditField
            key={i}
            label={prop}
            placeholder={String(object[prop])}
            disabled={ prop === "id" || (prop === "title" && object.category === "table") }
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
