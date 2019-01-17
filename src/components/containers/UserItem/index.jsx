import * as React from 'react';
import MultiColorSVG from '../../presentational/MultiColorSVG/index';
import IconSVG from '../../presentational/IconSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';


export default function UserItem(props) {
    
    const { user } = props;

    return (
        <div className="userItem">
            <MultiColorSVG
                width="30px"
                fill={['#E7ECED', /*'#556080'*/'#F9BF05']}
                content={iconPaths.user}
            />
            <div className="userInfo">
                <div>{user.title}</div>
                <div>{user.capability}</div>
            </div>
            <IconSVG width="15px" content={iconPaths.edit} />
            <IconSVG width="15px" content={iconPaths.delete} />

        </div>         
    );
};