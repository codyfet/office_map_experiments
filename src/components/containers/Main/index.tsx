import * as React from "react";
import GlobalArea from '../GlobalArea/index';
import IconDelete from '../../presentational/IconDelete';
import IconEdit from '../../presentational/IconEdit';
import IconReady from '../../presentational/IconReady';
import IconTurn from '../../presentational/IconTurn';

// простейший svg:
// const vertices = [
//   [0,60],
//   [30,0],
//   [60,60],
// ];

// function Triangle({vertices, color}) {
//     const pathData = [
//       'M', vertices[0][0], vertices[0][1],
//       'L', vertices[1][0], vertices[1][1],
//       'L', vertices[2][0], vertices[2][1],
//       'Z',
//     ].join(' ');

//     return (
//       <path d={ pathData } fill={ color } />
//     );
// }


export default class Main extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 style={{fontFamily: 'Helvetica'}}>  Office map</h1>
        <GlobalArea className="container"/>
        <IconDelete width="20px"/>
        <IconEdit width="20px" style={{ margin: '10px'}}/>
        <IconReady width="20px"/>
        <IconTurn width="20px"/>
      </React.Fragment>
    );
  }
}
