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

  handleCreateProjectPanelClose = () => {
    this.setState({
      showCreateProjectPanel: false
    });
  }

  selectObjectsOnMap = (projectId) => {
    const { actions, objects, users } = this.props;
    // ищем столы (объекты) на карте, где сидит пользователь, 
    // который работает над указаннным проектом

    // загрузить объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];
    const requiredObjectIds = thisLevelObjects.map((elem) => {
      const requiredUser = users.find(user => user.id === elem.userId);
      if (!!requiredUser && requiredUser.projectId === projectId) return elem.id;
      else return undefined;
    }).join(' ');

    actions.changeCurrentObject(requiredObjectIds); 
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
            projectId={project.projectId}
            projectTitle={project.title}
            isSelected={selectedProjectId === project.projectId}  
            onClick={this.handleProjectItemClick}  
          /> 
        </li>
      );
    });

    // получить новый id для проекта:
    // const { users } = this.props;
    // const lastId = users.reduce((prevVal, nextVal, i) => {
    //   let prevId;
    //   let nextId;
    //   if (i === 1) {
    //     prevId = Number(prevVal.id.slice(1));
    //     nextId = Number(nextVal.id.slice(1));
    //   } else {
    //     prevId = prevVal;
    //     nextId = Number(nextVal.id.slice(1));
    //   }

    //   return nextId > prevId ? nextId : prevId;
    // });

    // const newId = `t${String(lastId + 1).padStart(4, '0')}`;
    const newDefaultProject = {
      id: '',
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
  currentObject: state.currentObject
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ changeCurrentObject }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsList);