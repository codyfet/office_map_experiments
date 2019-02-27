import React from 'react';
import './styles.css';

export default class ProjectItem extends React.Component {
  handleClick = () => {
    const { projectId, onClick, isSelected } = this.props;
    if (!isSelected) {
      onClick(projectId);
    } else {
      onClick('');
    }
  };

  render() {
    const { projectTitle, isSelected } = this.props;

    return (
      <div
        className={isSelected ? 'projectItemSelected' : 'projectItem'}  
        onClick={this.handleClick}  
      > 
        <div>{projectTitle}</div>
      </div>
    );
  }
}
