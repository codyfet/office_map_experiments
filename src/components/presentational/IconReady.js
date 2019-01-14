import React from "react";

const SVG = ({
  style = {},
  fill = "#FFA500",
  width="100%",
  className = "x"
}) => (
    <svg
        style={style}
        width={width}
        height={width}
        className={`svg-icon ${className || ""}`}
        xmlns='http://www.w3.org/2000/svg' 
        id='Capa_1' 
        viewBox='0 0 174.239 174.239'
    >
        <g fill={fill}>
            <path d='M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305 c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z'
            />
            <path d='M131.55,59.413c-3.231-2.562-7.927-2.027-10.491,1.211L86.694,103.95L66.132,82.015c-2.812-3.014-7.543-3.155-10.555-0.345 c-3.009,2.825-3.162,7.55-0.34,10.555l26.481,28.251c1.415,1.512,3.389,2.363,5.447,2.363c0.102,0,0.204,0,0.309-0.005 c2.168-0.092,4.193-1.123,5.542-2.825L132.76,69.9C135.322,66.672,134.78,61.976,131.55,59.413z'
            />
        </g>
    </svg>
);

export default SVG;
