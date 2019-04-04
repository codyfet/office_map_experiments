import React from 'react';
import { DebounceInput } from 'react-debounce-input';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  changeCurrentObject
} from '../../../../actions/index';

import ProjectItem from '../ProjectItem/index';
import ProjectCreate from '../../ProjectCreate/index';
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

  handleCreateProjectPanelClose = () => {
    this.setState({
      showCreateProjectPanel: false
    });
  }

  selectObjectsOnMap = (projectId) => {
    const { actions, objects, users } = this.props;
    // если projectId нет - просто сбросим выделение:
    if (projectId === '') { 
      actions.changeCurrentObject('');
      return;
    } 

    // ищем столы (объекты) на карте, где сидит пользователь, 
    // который работает над указаннным проектом

    // загрузить объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const requiredObjectIds = thisLevelObjects.map((elem) => {
      // нам нужны только столы:
      if (elem.category === 'table') {
        const requiredUser = users.data.find(user => user.id === elem.userId);
        if (!!requiredUser && requiredUser.projectId === projectId) return elem.id;
        else return '';
      }
      return '';
    }).join(' ').trim();

    if (requiredObjectIds === '') {
      alert('ПРЕДУПРЕЖДЕНИЕ: На этой карте нет столов с пользователями на выбранном проекте');
    } else {
      actions.changeCurrentObject(requiredObjectIds);  
    }
  }

  render() {
    const { selectedProjectId, showCreateProjectPanel, searchPhrase } = this.state;
    const { projects } = this.props;

    const requiredProjects = projects.filter((p) => {
      const pTitle = p.title.toLowerCase();
      const formattedSPhrase = searchPhrase.toLowerCase();
      if (formattedSPhrase === '') return true;
      else return pTitle.startsWith(formattedSPhrase);
    });

    const loadProjects = requiredProjects.map((project) => {
      return (
        <li key={project.id}>
          <ProjectItem
            projectId={project.projectId}
            projectTitle={project.title}
            isSelected={selectedProjectId === project.projectId}  
            onClick={this.handleProjectItemClick}  
          /> 
        </li>
      );
    });

    // получить новый id для проекта:
    const lastId = projects.reduce((prevVal, nextVal, i) => {
      let prevId;
      let nextId;
      if (i === 1) {
        prevId = Number(prevVal.id.slice(1));
        nextId = Number(nextVal.id.slice(1));
      } else {
        prevId = prevVal;
        nextId = Number(nextVal.id.slice(1));
      }

      return nextId > prevId ? nextId : prevId;
    });

    const newId = `p${lastId + 1}`;

    const newDefaultProject = {
      id: newId,
      projectId: 'name',
      title: 'Название',
      about: 'Информация о проекте'
    };

    return (
      <div className="projectsListWrapper">
        <DebounceInput minLength={1} debounceTimeout={300} onChange={this.handleChangeInput} />
        <button type="submit" className="buttonAddProject" onClick={this.handleBtnAddProject}>
          Добавить проект
        </button>
        {showCreateProjectPanel && (
          <ProjectCreate 
            project={newDefaultProject} 
            onClose={this.handleCreateProjectPanelClose}
          />
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
  currentObject: state.currentObject,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ changeCurrentObject }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsList);