import React from "react";

const SVG = ({
  style = {},
  fill = "#FFA500",
  width="100%",
  className = "x",
  viewBox = "0 0 174.239 174.239",
  onClick= (() => console.log('nothing'))
}) => (
  <div onClick={onClick} style={style}>
    <svg
      width={width}
      height={width}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon ${className || ""}`}
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill={fill}
    >
      <g>
        <path
          d="M174.239,31.452h-16.42h-41.773V0.319H58.204v31.133H16.42H0v16.335h16.42V173.92h141.399V47.787h16.42V31.452z    M74.539,16.654h25.172v14.798H74.539V16.654z M141.484,157.585H32.755V47.787h25.449h57.842h25.438V157.585z"
        />
      </g>
      
      
    </svg>
  </div>
  
);

export default SVG;
