import * as React from "react";
import GlobalArea from '../GlobalArea/index';
import './styles.css'

export default class Main extends React.Component {

  render() {
    return (
      <div className="myContainer">
        <h1>Office map</h1>
        <GlobalArea />
      </div>
    );
  }
}
