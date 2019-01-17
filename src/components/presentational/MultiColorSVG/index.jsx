import React from "react";
import PropTypes from 'prop-types';
import './styles.css';

class MultiColorSVG extends React.Component {
  
  render() {
    const { width, fill, content, onClick } = this.props;
    
    const unzippedContent = content.map( (elem, i) => {
      return (
        <path 
          key={i} 
          d={elem}
          fill={fill[i]}
        />
      );
    });

    return (
      <div className="svg_image" onClick={onClick}>
        <svg 
            width={width}
            height={width} 
            xmlns='http://www.w3.org/2000/svg'  
            viewBox='0 0 53 53'
        >
            <g>
              {unzippedContent}
            </g>
        </svg>  
      </div>
      
    );
  }

};

MultiColorSVG.propTypes = {
    width: PropTypes.string,
    fill: PropTypes.array, 
    // style: React.CSSProperties,
    content: PropTypes.array
};

MultiColorSVG.defaultProps = {
    width: "100%",
    fill: [],
    content: []
};

export default MultiColorSVG;


