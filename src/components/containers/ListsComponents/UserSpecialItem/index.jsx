import * as React from 'react';
import iconPaths from '../../../../res/iconPaths';
import AdvancedSVG from '../../../presentational/AdvancedSVG/index';
import './styles.css';

export default function UserSpecialItem(props) {
    
    const { user, onClick, isSelected } = props;
    
    function onUserSpecialItemClick() {
        if ( !isSelected ) {
            onClick(user.id);
        } else {
            onClick('');
        }
    }

    return (
        <div 
            className={ isSelected ? "selectedUserItem" : "userItem" } 
            onClick={onUserSpecialItemClick}
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


        </div>         
    );
};