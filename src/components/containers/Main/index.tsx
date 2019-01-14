import * as React from "react";
import GlobalArea from '../GlobalArea/index';


export default class Main extends React.Component {

  state = {
    fill: "#FFA500"
  }

  handleMouseOver(){
    this.setState({
      fill: "black"
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1 style={{fontFamily: 'Helvetica'}}>  Office map</h1>
        <GlobalArea className="container"/>
      </React.Fragment>
    );
  }
}
