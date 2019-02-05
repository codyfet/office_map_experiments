import React from 'react';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeCurrentObject, changeCurrentUser } from '../../../actions/index';

// статические данные карты:
import objectCategories from '../../../res/objectCategories.json';


export default class CurrentObjectItem extends React.Component {
    
    getSettingsForObject(object) {
        // на случай, если объект пустой:
        if ( object === undefined ) {
            return {
                text: 'Unknown',
                fill: ['black'],
                content: iconPaths.table
            };
        }

        // иначе:
        let rezult = { 
            text: objectCategories.find((cat) => cat.id === object.category).title,
            fill: ['black'] 
        };

        switch(object.category) {
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

            case "column":
                rezult.content = iconPaths.column;
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
            onClick( object.category );
        } else {
            onClick('');
        }
    }

    render() {
        const { object, isSelected } = this.props;
        const { content, text, fill } = this.getSettingsForObject(object);

        return (
            <div 
                className={ isSelected ? "currentObjectItemSelected " : "currentObjectItem" } 
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
    