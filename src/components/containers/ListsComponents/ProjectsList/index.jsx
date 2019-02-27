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

  handleProjectItemClick = (id) => {
    // в этой функции по project id надо будет выделять объекты на сцене:
    const { objects, users } = this.props;
    // to-do
    this.setState({
      selectedProjectId: id,
      searchPhrase: ''
    });
  };

  handleBtnAddProject = () => {
    this.setState({
      showCreateProjectPanel: true,
    });
  }

  render() {
    const { selectedProjectId, showCreateProjectPanel, searchPhrase } = this.state;

    const loadProjects = [...Array(20)].map((elem, i) => {
      return (
        <li>
          <ProjectItem
            key={i}
            projectId={i}
            projectTitle={`Проект # ${i}`}
            isSelected={selectedProjectId === i}  
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