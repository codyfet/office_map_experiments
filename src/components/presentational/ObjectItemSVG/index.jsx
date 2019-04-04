import React from 'react';
import './styles.css';

const ObjectItemSVG = React.memo(props => { 
  let { width, height, content } = props;
  const { onClick } = props;

  // значения по умолчанию:
  width = width || '100%';
  height = height || '100%';
  content = content || [];

  const unzippedContent = content.elements.map((elem, i) => {
    return <g key={i}>{elem}</g>;
  });

  return (
    <div className="svg_image" onClick={onClick}>
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={content.viewBox}
      >
        <g>{content.elements}</g>
      </svg>
    </div>
  );
});

export default ObjectItemSVG;
