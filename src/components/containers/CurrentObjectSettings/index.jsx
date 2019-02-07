import * as React from "react";
import EditField from "../../containers/EditField/index";

import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser, changeCurrentUser } from "../../../actions/index";

class CurrentObjectSettings extends React.Component {
  render() {
    const { object } = this.props;

    // определим свойства, которые можно редактировать:
    const allowedProperties = [
      "category",
      "coordinates",
      "width",
      "height",
      "movable"
    ];
    const editFieldsPanel = allowedProperties.map((prop, i) => {
      if (prop === "coordinates") {
        return (
          <React.Fragment>
            <EditField
              label="coordinates.x"
              placeholder={String(object[prop].x)}
            />
            <EditField
              label="coordinates.y"
              placeholder={String(object[prop].y)}
            />
          </React.Fragment>
        );
      } else {
        return (
          <EditField
            label={prop}
            placeholder={String(object[prop])}
          />
        );
      }
     
    });

    

    return (
      <div className="currentObjectSettingsContainer">
        {editFieldsPanel}
        <div className="buttonsSet">
          <button 
            className="buttonAccept"
          >
            Применить
          </button>
          <button
            className="buttonClose"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }
}

//for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  currentObject: state.currentObject
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser, changeCurrentUser }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentObjectSettings);
