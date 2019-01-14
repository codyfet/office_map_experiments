import React from "react";
import PropTypes from 'prop-types';

class IconSVG extends React.Component {
  
  render() {
    const { width, fill, style, content } = this.props;
    
    const unzippedContent = content.map( (elem, i) => {
      return <path key={i} d={elem}/>;
    });

    return (
      <svg 
        width={width}
        height={width}
        style={style}       
        xmlns='http://www.w3.org/2000/svg'  
        viewBox='0 0 174.239 174.239'
      >
        <g fill={fill}>
          {unzippedContent}
        </g>
      </svg>
    );
  }

};

// IconSVG.propTypes = {
//     width: PropTypes.string,
//     fill: PropTypes.string, 
//     style: React.CSSProperties,
//     content: any
// };

IconSVG.defaultProps = {
    width: "100%",
    fill: "#FFA500", 
    style: {},
    content: <g></g>
};

export default IconSVG;


