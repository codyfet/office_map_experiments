import * as React from 'react';
import iconPaths from '../../../../res/iconPaths';
import AdvancedSVG from '../../../presentational/AdvancedSVG/index';
import './styles.css';

export default function UserButtonedItem(props) {
  const { user, onItemClick, onEditClick, isSelected, onDeleteClick } = props;

  function onUserSpecialItemClick() {
    if (!isSelected) {
      onEditClick(user.id);
    } else {
      onEditClick('');
    }
  }

  function onUserDeleteClick() {
    onDeleteClick(user.id);
  }

  function handleItemClick() {
    onItemClick(user.id);
  }

  return (
    <div className={isSelected ? 'selectedUserButtonedItem' : 'userButtonedItem'}>
      <AdvancedSVG
        width="30px"
        fill={['#E7ECED', /* '#556080' */ '#F9BF05']}
        content={iconPaths.user}
        onClick={handleItemClick}
      />
      <div className="userInfo">
        <div>{user.title}</div>
        <div>{user.capability}</div>
      </div>
      <AdvancedSVG width="20px" content={iconPaths.edit} onClick={onUserSpecialItemClick} />
      <AdvancedSVG width="20px" content={iconPaths.delete} onClick={onUserDeleteClick} />
    </div>
  );
}
