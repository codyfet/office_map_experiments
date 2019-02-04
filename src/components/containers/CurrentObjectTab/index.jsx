import * as React from "react";
import ObjectItem from "../../containers/ObjectItem/index";
import UserSpecialItem from "../../containers/UserSpecialItem/index";
import UsersSpecialList from "../../containers/UsersSpecialList/index";
import CurrentObjectItem from "../../containers/CurrentObjectItem/index";

import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser, changeCurrentUser } from "../../../actions/index";

class CurrentObjectTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showObjectInfo: false,
      showUserInfo: false
    };
  }

  checkUserAssignedToTable(userId) {
    // если пользователя нет, то проверять ничего не надо:
    if ( userId === '' ) {
      return false
    }

    // иначе ищем пользователя по объектам всех уровней:
    const { objects } = this.props;
    for ( let lvl of objects.levels) {
      for ( let obj of lvl) {
        if ( obj.userId === userId ) {
          return true;
        }
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

  // ? open changing user panel:
  openChangeUserPanel = (id) => {
    const { currentObject } = this.props;
    if ( currentObject.objectId === '' ) {
        alert("ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Щелкните на одном из объектов!");
    } else {
        this.setState({
            showUserInfo: !this.state.showUserInfo
        });
    }
    
  };

  // select user:
  selectUser = (newUserId) => {
    const { actions, currentObject } = this.props;

    if ( currentObject.userId === newUserId) { // если выбрали того же пользователя
      alert("ПРЕДУПРЕЖДЕНИЕ: ВЫ ВЫБРАЛИ ТОГО ЖЕ ПОЛЬЗОВАТЕЛЯ. LOL=) А зачем?)");
    } else if ( this.checkUserAssignedToTable(newUserId) ) {
      alert("ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!");
    } else {
      const newObjData = {
        id: currentObject.objectId,
        userId: newUserId
      };
      actions.updateUser(newObjData);
      actions.changeCurrentUser(newUserId);
    }

    this.setState({
        showUserInfo: !this.state.showUserInfo
    });
  };

  render() {
    const { currentObject, objects, users } = this.props;

    // вынуть объекты текущего уровня:
    const thisLevelObjects = objects.levels[objects.mapLevel];

    const requiredObject = thisLevelObjects.find(val => val.id === currentObject.objectId);
    var requiredUser = {
      title: "Not assigned",
      capability: ""
    };
    if (requiredObject !== undefined) {
      // объект определен

      if (currentObject.userId !== undefined && currentObject.userId !== '') {
        // к объекту привязан пользователь
        requiredUser = users.find(val => val.id === currentObject.userId);
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
          Выбранный объект #ID: {currentObject.objectId}
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
  users: state.users,
  currentObject: state.currentObject
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateUser, changeCurrentUser }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentObjectTab);
