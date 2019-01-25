import React from 'react';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';


export default class ObjectItem extends React.Component {
    
    getSettingsForObject(object) {
        let rezult = { 
            text: object.title,
            fill: ['black'] 
        };
        
        
        switch(object.id) {
            case "table":
                rezult.content = iconPaths.table;
                break;
            case "cupboard":
                rezult.content = iconPaths.cupboard;
                break;
            case "printer":
                rezult.content = iconPaths.printer;
                break;
    
            case "scaner":
                rezult.content = iconPaths.scaner;
                break;
            
            case "shredder":
                rezult.content = iconPaths.shredder;
                break;

            case "meeting_room":
                rezult.content = iconPaths.meeting_room;
                break;
            
            case "public_place":
                rezult.content = iconPaths.public_place;
                break;
    
            default:
                break;
        }

        return rezult;
    }

    onObjectClick = () => {
        const { object, onClick, isSelected } = this.props;
        if ( !isSelected ) {
            onClick(object.id);
        } else {
            onClick('');
        }
    }

    render() {
        const { object, isSelected } = this.props;
        const { content, text, fill } = this.getSettingsForObject(object);

        return (
            <div 
                className={ isSelected ? "objectItemSelected " : "objectItem" } 
                onClick={this.onObjectClick}
            >
                <AdvancedSVG
                    width="30px"
                    fill={fill}
                    content={content}
                />
                <div>
                    {text}
                </div>

            </div>         
        );
    }
};
    