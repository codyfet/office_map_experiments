import React from 'react';
import './styles.css';

const AdvancedSVG = (props) => { 
  let { width, fill, content } = props;
  const { onClick } = props;

  // значения по умолчанию:
  width = width || '100%';
  fill = fill || ['#FFA500'];
  content = content || [];

  const unzippedContent = content.path.map((elem, i) => {
    return <path key={i} d={elem} fill={fill[i]} />;
  });

  return (
    <div className="svg_image" onClick={onClick}>
      <svg
        width={width}
        height={width}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={content.viewBox}
      >
        <g fill={fill}>{unzippedContent}</g>
      </svg>
    </div>
  );
};

export default AdvancedSVG;
