import * as React from "react";
import ObjectItem from "../../containers/ObjectItem/index";
import UserSpecialItem from "../../containers/UserSpecialItem/index";
import UsersSpecialList from "../../containers/UsersSpecialList/index";
import CurrentObjectItem from "../../containers/CurrentObjectItem/index";

import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser } from "../../../actions/index";

class CurrentObjectTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showObjectInfo: false,
      showUserInfo: false
    };
  }

  checkUserAssignedToTable(userId) {
    const { objects } = this.props;
    for (let obj of objects.levels[objects.mapLevel]) {
      if (obj.userId === userId) {
        return true;
      }
    }
    return false;
  }

  // select object:
  selectObject = id => {
    this.setState({
      showObjectInfo: !this.state.showObjectInfo
    });
  };

  // open changing user panel:
  openChangeUserPanel = (id) => {
    const { selectedObjectId } = this.props;
    if ( selectedObjectId === '' ) {
        alert("ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Щелкните на одном из объектов!");
    } else {
        this.setState({
            showUserInfo: !this.state.showUserInfo
        });
    }
    
  };

  // select user:
  selectUser = newUserId => {
    const { actions, selectedObjectId } = this.props;

    if ( this.checkUserAssignedToTable(newUserId) ) {
      alert("ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!");
    } else {
      const newObjData = {
        id: selectedObjectId,
        userId: newUserId
      };
      actions.updateUser(newObjData);
    }

    this.setState({
        showUserInfo: !this.state.showUserInfo
    });
  };

  render() {
    const { selectedObjectId, objects, users } = this.props;

    // вынуть объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];

    const requiredObject = thisLevelObjects.find(val => val.id === selectedObjectId);
    var requiredUser = {
      title: "Not assigned",
      capability: ""
    };
    if (requiredObject !== undefined) {
      // объект определен

      if (requiredObject.userId !== undefined && requiredObject.userId !== "") {
        // к объекту привязан пользователь
        requiredUser = users.find(val => val.id === requiredObject.userId);
      }
    } // иначе - либо объект не определен, либо к нему не привязан пользователь

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <label className="labelCurrObj">
          Выбранный объект #ID: {selectedObjectId}
        </label>
        <CurrentObjectItem
          object={requiredObject}
          isSelected={false}
          onClick={this.selectObject}
        />
        <label className="labelCurrObj">Информация о пользователе:</label>
        <UserSpecialItem
            user={requiredUser}
            isSelected={false}
            onClick={this.openChangeUserPanel}
        />
        {this.state.showUserInfo && (
          <UsersSpecialList onUserClick={this.selectUser} />
        )}
      </div>
    );
  }
}

//for redux:
const mapStateToProps = state => ({
  objects: state.objects,
  users: state.users
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentObjectTab);
