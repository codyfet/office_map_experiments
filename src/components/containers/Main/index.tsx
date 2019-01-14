import * as React from "react";
import GlobalArea from '../GlobalArea/index';
import IconDelete from '../../presentational/IconDelete';
import IconEdit from '../../presentational/IconEdit';
import IconReady from '../../presentational/IconReady';
import IconTurn from '../../presentational/IconTurn';
import IconSVG from '../../presentational/IconSVG';
import iconPaths from '../../../res/iconPaths';

import './styles.css';

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
        <IconDelete className="svg_image"
                    width="20px"
        />
        <IconEdit width="20px" style={{ margin: '10px'}}/>
        <IconReady width="20px" className="svg_image" />
        {/* <IconTurn width="20px"/> */}
      </React.Fragment>
    );
  }
}
