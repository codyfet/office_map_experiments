import * as React from "react";
import UserCurrentItem from "../../containers/ListsComponents/UserCurrentItem/index";
import UsersSpecialList from "../../containers/ListsComponents/UsersSpecialList/index";
import CurrentObjectItem from "../../containers/CurrentObjectItem/index";
import CurrentObjectSettings from "../../containers/CurrentObjectSettings/index";

import "./styles.css";

// redux:
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser, changeCurrentUser } from "../../../actions/index";

class CurrentObjectTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showObjectSettings: false,
      showChangeUserPanel: false
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
  openCloseObjectSettings = () => {
    this.setState({
      showObjectSettings: !this.state.showObjectSettings
    });
  };

  // open object settings panel:
  closeObjectSettings = () => {
    this.setState({
      showObjectSettings: false
    });
  }

  // open changing user panel:
  openChangeUserPanel = (id) => {
    const { currentObject } = this.props;
    if ( currentObject.objectId === '' ) {
        alert("ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Щелкните на одном из объектов!");
    } else {
        this.setState({
            showChangeUserPanel: !this.state.showChangeUserPanel
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
        showChangeUserPanel: !this.state.showChangeUserPanel
    });
  };

  onDeleteUser = () => {
    const { actions, currentObject } = this.props;
    const newUserId = "";
    const newObjData = {
      id: currentObject.objectId,
      userId: newUserId
    };
    actions.updateUser(newObjData);
    actions.changeCurrentUser(newUserId);
  

    this.setState({
        showChangeUserPanel: false
    });
  }

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
      <div className="currentObjectContainer">
        <div className="labelCurrObj">
          Изменить выбранный объект #ID: {currentObject.objectId}
        </div>
        <CurrentObjectItem
          object={requiredObject}
          isSelected={false}
          onClick={this.openCloseObjectSettings}
        />
        {
          requiredObject !== undefined && this.state.showObjectSettings && 
          <CurrentObjectSettings 
            object={requiredObject}
            closeSettings={this.closeObjectSettings}
          />
        }
        { /*Пользователь показывается, только если текущий объект - стол: */
          requiredObject !== undefined  && requiredObject.category === "table" &&
          <div className="currentObjectContainer">
            <div className="labelCurrObj">Изменить пользователя:</div>
            <UserCurrentItem
                user={requiredUser}
                isSelected={false}
                onClick={this.openChangeUserPanel}
                onDeleteClick={this.onDeleteUser}
            />
          </div>
          
        }
        {
          this.state.showChangeUserPanel && (
            <UsersSpecialList 
              onUserClick={this.selectUser} 
            />
          )
        }
        
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
