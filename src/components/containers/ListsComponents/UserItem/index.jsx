import * as React from 'react';
import iconPaths from '../../../../res/iconPaths';
import AdvancedSVG from '../../../presentational/AdvancedSVG/index';
import './styles.css';


export default function UserItem(props) {
    
    const { user } = props;

    return (
        <div className="userItem">
            <AdvancedSVG
                width="30px"
                fill={['#E7ECED', /*'#556080'*/'#F9BF05']}
                content={iconPaths.user}
            />
            <div className="userInfo">
                <div>{user.title}</div>
                <div>{user.capability}</div>
            </div>
            <AdvancedSVG width="15px" content={iconPaths.edit} />
            <AdvancedSVG width="15px" content={iconPaths.delete} />

        </div>         
    );
};