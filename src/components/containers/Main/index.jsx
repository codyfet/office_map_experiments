import * as React from 'react';
import GlobalArea from '../GlobalArea/index';
// import MainHeader from '../../presentational/MainHeader/index';
import './styles.css';

const Main = () => (
  <div className="myContainer">
    {/* <MainHeader /> */}
    <div className="labelMainHeader">Office map</div>
    <GlobalArea />
  </div>
);

export default Main;
