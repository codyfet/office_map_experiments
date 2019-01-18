import React from "react";
import ObjectItem from '../ObjectItem/index';
import "./styles.css";

// статические данные карты:
import mapData from '../../../res/mapData.json';

export default class ObjectsList extends React.Component {
  
  state = {
    selectedObjectId: '' 
  };

  selectObject = (id) => {
    this.setState({
      selectedObjectId: id
    });
  }

  render() {
    const searchList = mapData.categories.slice(1);

    let loadObjects = searchList.map((elem, i) => {
      return (
        <li key={i}>
            <ObjectItem 
              object={elem}
              isSelected={false}
              onClick={this.selectObject} 
            />
        </li>
      );
    }); 

    // если выбрали элемент:
    let isSelected = false;
    const foundObject = searchList.find((elem) => (elem.id === this.state.selectedObjectId));
    if ( foundObject !== undefined ) {
      isSelected = true;
      loadObjects = (
        <li key={0}>
            <ObjectItem 
              object={foundObject}
              isSelected={true}
              onClick={this.selectObject}  
            />
        </li>
      );
    } 
    
    return (
      <React.Fragment>
        <ul className="typeSearchList">
          {loadObjects}
        </ul>

      </React.Fragment>
    );
  }
}

