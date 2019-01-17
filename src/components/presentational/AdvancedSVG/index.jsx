import React from "react";
import PropTypes from 'prop-types';
import './styles.css';

class AdvancedSVG extends React.Component {
  
  render() {
    const { width, fill, content, onClick, viewBox } = this.props;
    
    const unzippedContent = content.map( (elem, i) => {
      return <path key={i} d={elem}/>;
    });

    return (
      <div className="svg_image" onClick={onClick}>
        <svg 
            width={width}
            height={width} 
            xmlns='http://www.w3.org/2000/svg'  
            viewBox={viewBox}
        >
            <g fill={fill}>
            {unzippedContent}
            </g>
        </svg>  
      </div>
      
    );
  }

};

AdvancedSVG.defaultProps = {
    width: "100%",
    fill: "#FFA500",
    content: []
};

export default AdvancedSVG;


