import * as React from 'react';
import GlobalArea from '../GlobalArea/index';
import MainHeader from '../../presentational/MainHeader/index';
import './styles.css';

export default class Main extends React.Component {
  render() {
    return (
      <div className="myContainer">
        {/* <MainHeader /> */}
        <h1>Office map</h1>
        <GlobalArea />
      </div>
    );
  }
}
