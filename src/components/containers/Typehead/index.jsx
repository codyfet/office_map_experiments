import React from "react";
import ObjectItem from '../ObjectItem/index';
import "./styles.css";

export default class Typehead extends React.Component {
  
  render() {
    // const { searchList } = this.props;
    const searchList = [
        { category: "table" },
        { category: "cupboard" }
    ];
    const loadElements = searchList.map((elem, i) => {
      return (
        <li key={i}>
            <ObjectItem object={elem}/>
        </li>
      );
    }); 

    return (
      <React.Fragment>
        <input className="textInput" type="text" />
        <ul className="typeSearchList">
          {loadElements}
        </ul>


      </React.Fragment>
    );
  }
}

