import React from "react";
import objectCategories from './../../../../res/objectCategories.json';
import ObjectItem from './../ObjectItem/index';
import "./styles.css";

export default class ObjectsList extends React.Component {

  onObjectClick = (id) => {
    const { objectId, onObjectClick } = this.props;

    // если объект не выбран:
    if ( objectId === '' ) {
      onObjectClick(id);
    } else { // если повторный клик:
      onObjectClick('');
    }
    
  }

  render() {
    // до 4-ой позиции идут категории статичных объектов и пользователей:
    const searchList = objectCategories.slice(5);

    let loadObjects = searchList.map((elem, i) => {
      return (
        <li key={i}>
            <ObjectItem 
              object={elem}
              isSelected={false}
              onClick={this.onObjectClick} 
            />
        </li>
      );
    }); 

    // если выбрали элемент:
    let isSelected = false;
    const foundObject = searchList.find((elem) => (elem.id === this.props.objectId));
    if ( foundObject !== undefined ) {
      isSelected = true;
      loadObjects = (
        <li key={0}>
            <ObjectItem 
              object={foundObject}
              isSelected={true}
              onClick={this.onObjectClick}  
            />
        </li>
      );
    } 
    
    return (
      <div 
        className="objectsListWrapper"
      >
        <ul 
          className={isSelected ? "objectsListChosen" : "objectsList"}
        >
          {loadObjects}
        </ul>

      </div>
    );
  }
}

