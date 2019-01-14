import React from "react";
import PropTypes from 'prop-types';
import './styles.css';

class IconSVG extends React.Component {
  
  render() {
    const { width, fill, content, onClick } = this.props;
    
    const unzippedContent = content.map( (elem, i) => {
      return <path key={i} d={elem}/>;
    });

    return (
      <div className="svg_image" onClick={onClick}>
        <svg 
            width={width}
            height={width} 
            xmlns='http://www.w3.org/2000/svg'  
            viewBox='0 0 174.239 174.239'
        >
            <g fill={fill}>
            {unzippedContent}
            </g>
        </svg>  
      </div>
      
    );
  }

};

IconSVG.propTypes = {
    width: PropTypes.string,
    fill: PropTypes.string, 
    // style: React.CSSProperties,
    content: PropTypes.array
};

IconSVG.defaultProps = {
    width: "100%",
    fill: "#FFA500",
    content: []
};

export default IconSVG;


