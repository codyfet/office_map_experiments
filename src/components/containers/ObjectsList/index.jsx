import React from "react";
import ObjectItem from '../ObjectItem/index';
import "./styles.css";

// статические данные карты:
import mapData from '../../../res/mapData.json';

//для анимации переходов компонентов:
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class ObjectsList extends React.Component {
  
  state = {
    selectedObjectId: '' 
  };

  selectObject = (id) => {
    const { onObjectClick } = this.props;

    this.setState({
      selectedObjectId: id
    });

    // pass information to SidePanel
    onObjectClick(id);

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
      <div className="objectsListWrapper">
        <ul className="objectsList">
          <ReactCSSTransitionGroup
                  transitionName="fade"
                  transitionEnterTimeout={2000}
                  transitionLeaveTimeout={2000}
          >
            {loadObjects}
          </ReactCSSTransitionGroup>
        </ul>

      </div>
    );
  }
}

