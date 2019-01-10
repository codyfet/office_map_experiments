import * as React from "react";
import GlobalArea from '../../GlobalArea';

export default class Main extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 style={{fontFamily: 'Helvetica'}}>  Office map</h1>
        <GlobalArea />
      </React.Fragment>
    );
  }
}
