import * as React from 'react';
import './cssans.min.css';

export default class MainHeader extends React.Component {
  render() {
    return (
      <div className="cssans cssans--center">
        <div className="cssans__accessible">CSSans Pro</div>

        <div className="cssans__word">
          <b className="cssans:o" />
          <b className="cssans:f" />
          <b className="cssans:f" />
          <b className="cssans:i" />
          <b className="cssans:c" />
          <b className="cssans:e" />
        </div>

        <div className="cssans__word">
          <b className="cssans:m" />
          <b className="cssans:a" />
          <b className="cssans:p" />
        </div>
      </div>
    );
  }
}
