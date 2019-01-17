import * as React from "react";
import "./styles.css";

export default class Typehead extends React.Component {
  
  render() {
    const { searchList } = this.props;

    return (
      <React.Fragment>
        <input className="textInput" type="text" />


      </React.Fragment>
    );
  }
}

