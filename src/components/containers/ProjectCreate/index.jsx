import * as React from 'react';
// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createProject } from '../../../actions/index';

import EditField from '../EditField/index';
import './styles.css';

const _ = require('lodash');

class UserCreate extends React.Component {
  state = {
    projectSettings: {},
  };

  componentWillUnmount() {
    // чтобы сбросить данные:
    this.setState({
      projectSettings: {},
    });
  }

  handleInputChange = (settings) => {
    const { projectSettings } = this.state;
    let newProjectSettings = Object.assign({}, projectSettings);
    newProjectSettings = Object.assign(newProjectSettings, settings);

    this.setState({
      projectSettings: newProjectSettings,
    });
  };

  // ОБРАБОТЧИКИ КНОПОК:
  handleBtnCreateClick = () => {
    const { actions, project, onClose } = this.props;
    const { projectSettings } = this.state;

    const projectData = _.clone(project);
    try {
      Object.keys(projectSettings).forEach(key => {
        projectData[key] = projectSettings[key];
      });
    } catch (e) {
      alert(`ОШИБКА: НЕПРАВИЛЬНЫЙ ВВОД ДАННЫХ: ${e.message}`);
      return;
    }

    actions.createProject(projectData);

    onClose();
  };

  handleBtnCancelClick = () => {
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const { project } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      'id',
      'projectId',
      'title',
      'about'
    ];
    const editFieldsPanel = allowedProperties.map((prop) => {
      if (project === undefined) {
        return undefined;
      }

      return (
        <EditField
          key={prop}
          label={prop}
          placeholder={String(project[prop])}
          disabled={prop === 'id'}
          onInputChange={this.handleInputChange}
        />
      );
    });

    return (
      <div className="projectCreateContainer">
        {editFieldsPanel}
        {project !== undefined && (
          <div className="buttonsSet">
            <button type="submit" className="buttonProjectCreate" onClick={this.handleBtnCreateClick}>
              Создать
            </button>
            <button type="submit" className="buttonProjectCancel" onClick={this.handleBtnCancelClick}>
              Отменить
            </button>
          </div>
        )}
      </div>
    );
  }
}

// for redux:
const mapStateToProps = state => ({
  objects: state.objects,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ createProject }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserCreate);
