import React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DebounceInput } from 'react-debounce-input';
import ProjectItem from '../ProjectItem/index';
import mapData from '../../../../res/mapData.json';
import './styles.css';


class ProjectsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: '',
      selectedProjectId: '',
      showCreateProjectPanel: false,
    };
  }

  handleChangeInput = (e) => {
    this.setState({
      searchPhrase: e.target.value,
    });
  };

  handleProjectItemClick = (projectId) => {
    this.selectObjectsOnMap(projectId);
    this.setState({
      selectedProjectId: projectId,
      searchPhrase: ''
    });
  };

  handleBtnAddProject = () => {
    this.setState({
      showCreateProjectPanel: true,
    });
  }

  selectObjectsOnMap = (projectId) => {
    const { objects, users } = this.props;
    // ищем столы (объекты) на карте, где сидит пользователь, 
    // который работает над указаннным проектом
  }

  render() {
    const { selectedProjectId, showCreateProjectPanel, searchPhrase } = this.state;

    const requiredProjects = mapData.projects.filter((project) => {
      const projetTitle = project.title.toLowerCase();
      const formattedSPhrase = searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return projetTitle.startsWith(formattedSPhrase);
    });

    const loadProjects = requiredProjects.map((project) => {
      return (
        <li>
          <ProjectItem
            key={project.id}
            projectId={project.id}
            projectTitle={project.title}
            isSelected={selectedProjectId === project.id}  
            onClick={this.handleProjectItemClick}  
          /> 
        </li>
      );
    });

    return (
      <div className="projectsListWrapper">
        <DebounceInput minLength={1} debounceTimeout={300} onChange={this.handleChangeInput} />
        <button type="submit" className="buttonAddProject" onClick={this.handleBtnAddProject}>
          Добавить проект
        </button>
        {showCreateProjectPanel && (
          <div>Панель ProjectCreate в разработке</div>
        )}
        {!showCreateProjectPanel && (
          <ul className="projectsList">
            {loadProjects}
          </ul>
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  users: state.users,
  objects: state.objects,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsList);