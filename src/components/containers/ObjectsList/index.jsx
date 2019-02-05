import React from "react";
import ObjectItem from '../ObjectItem/index';
import "./styles.css";

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';

export default class ObjectsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedObjectId: ''
    }
  }

  selectObject = (id) => {
    this.setState({
      selectedObjectId: this.state.selectedObjectId === '' ? id : ''
    });

    // передаём информацию в SidePanel:
    const { onObjectClick } = this.props;
    onObjectClick(id);

  }

  render() {
    // до 4-ой позиции идут категории статичных объектов и пользователей:
    const searchList = objectCategories.slice(4);

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
      <div 
        className="objectsListWrapper"
      >
        <ul 
          className="objectsList"
        >
          {loadObjects}
        </ul>

      </div>
    );
  }
}

