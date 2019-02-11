import * as React from "react";
import './cssans.min.css';

export default class MainHeader extends React.Component {

  render() {
    return (
        <div className="cssans cssans--center">
            <div className="cssans__accessible">CSSans Pro</div>
        
            <div className="cssans__word">
                <b className="cssans:o"></b>
                <b className="cssans:f"></b>
                <b className="cssans:f"></b>
                <b className="cssans:i"></b>
                <b className="cssans:c"></b>
                <b className="cssans:e"></b>
            </div>
        
            <div className="cssans__word">
                <b className="cssans:m"></b>
                <b className="cssans:a"></b>
                <b className="cssans:p"></b>
            </div>
        </div>
    );
  }
}
