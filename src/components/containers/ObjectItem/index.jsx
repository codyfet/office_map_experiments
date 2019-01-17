import React from 'react';
import MultiColorSVG from '../../presentational/MultiColorSVG/index';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';


export default function ObjectItem(props) {
    
    const { object } = props;
    let content = '';
    let viewBox = '';
    let text = '';
    let fill = '';

    switch(object.category) {
        case "people":
            content = iconPaths.user;
            fill = ['white', 'black'];
            viewBox = "0 0 53 53";
            text = object.title;
            break;
        case "table":
            content = iconPaths.table;
            fill = 'black';
            viewBox = "0 -72 480 480";
            text = "Table";
            break;
        case "cupboard":
            content = iconPaths.cupboard;
            fill = 'black';
            viewBox = "0 0 490.667 490.667";
            text = "Cupboard";
            break;
        default:
            break;
    }

    return (
        <div className="objectItem">
            <AdvancedSVG
                width="30px"
                fill={fill}
                content={content}
                viewBox={viewBox}
            />
            <div>
                {text}
            </div>

        </div>         
    );
};