import * as React from 'react';
import AdvancedSVG from '../../presentational/AdvancedSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';


export default function UserCurrentItem(props) {
    
    const { user, onClick, isSelected, onDeleteClick } = props;
    
    function onUserSpecialItemClick() {
        if ( !isSelected ) {
            onClick(user.id);
        } else {
            onClick('');
        }
    }

    return (
        <div 
            className="userItem"
        >
            <AdvancedSVG
                width="30px"
                fill={['#E7ECED', /*'#556080'*/'#F9BF05']}
                content={iconPaths.user}
            />
            <div className="userInfo">
                <div>{user.title}</div>
                <div>{user.capability}</div>
            </div>
            <AdvancedSVG 
                width="20px" 
                content={iconPaths.edit} 
                onClick={onUserSpecialItemClick}
            />
            <AdvancedSVG 
                width="20px" 
                content={iconPaths.delete} 
                onClick={onDeleteClick}
            />

        </div>         
    );
};