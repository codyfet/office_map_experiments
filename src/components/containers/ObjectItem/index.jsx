import React from 'react';
import MultiColorSVG from '../../presentational/MultiColorSVG/index';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';


export default class ObjectItem extends React.Component {
    
    getSettingsForObject(object) {
        let rezult = { fill: 'black' };
        
        switch(object.id) {
            case "table":
                rezult.content = iconPaths.table;
                rezult.text = object.title;
    
                rezult.viewBox = "0 -72 480 480";
                break;
            case "cupboard":
                rezult.content = iconPaths.cupboard;
                rezult.text = object.title;
    
                rezult.viewBox = "0 0 490.667 490.667";
                break;
            case "printer":
                rezult.content = iconPaths.printer;
                rezult.text = object.title;
    
                rezult.viewBox = "0 -8 384 384";
                break;
    
            case "scaner":
                rezult.content = iconPaths.scaner;
                rezult.text = object.title;
    
                rezult.viewBox = "0 0 512 512";
                break;
    
            case "meeting_room":
                rezult.content = iconPaths.meeting_room;
                rezult.text = object.title;
    
                rezult.viewBox = "0 0 512 512";
                break;
            
            case "public_place":
                rezult.content = iconPaths.public_place;
                rezult.text = object.title;
    
                rezult.viewBox = "0 0 80.13 80.13";
                break;
    
            default:
                break;
        }

        return rezult;
    }

    handleClick = () => {
        const { object, onClick, isSelected } = this.props;
        if ( !isSelected ) {
            onClick(object.id);
        } else {
            onClick('');
        }
    }

    render() {
        const { object, isSelected } = this.props;
        const { content, viewBox, text, fill } = this.getSettingsForObject(object);

        return (
            <div 
                className={ isSelected ? "objectItemSelected " : "objectItem" } 
                onClick={this.handleClick}
            >
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
    }
};
    