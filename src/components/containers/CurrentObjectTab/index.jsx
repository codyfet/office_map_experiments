import * as React from 'react';
import ObjectItem from '../../containers/ObjectItem/index';
import UserSpecialItem from '../../containers/UserSpecialItem/index';
import CurrentObjectItem from '../../containers/CurrentObjectItem/index';

import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { createObject } from '../../../actions/index';


class CurrentObjectTab extends React.Component {

  state = {
    showObjectInfo: false,
    showUserInfo: false
  };
  
  // select object:
  selectObject = (id) => {
    this.setState({
        showObjectInfo: !this.state.showObjectInfo  
    });
  }

  // select user:
  selectUser = (id) => {
    this.setState({
        showUserInfo: !this.state.showUserInfo
    });
  }

  
  render() {

    const { selectedObjectId, objects, users } = this.props;

    const requiredObject = objects.find( (val) => (val.id === selectedObjectId) );
    var requiredUser;
    if ( requiredObject !== undefined ) {
        requiredUser = users.find( (val) => (val.id === requiredObject.userId) );
    
    }

    console.log('required:', requiredObject, requiredUser);

    return (
      <div style={{
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center'

      }}>
        <label className="labelCurrObj">Выбранный объект #ID: {selectedObjectId}</label>
        <CurrentObjectItem  
            object={requiredObject}
            isSelected={false}
            onClick={this.selectObject} 
        />
        <label className="labelCurrObj">Информация о пользователе:</label>
        {
            requiredObject !== undefined && requiredUser !== undefined &&
            <UserSpecialItem  
                user={requiredUser}
                isSelected={false}
                onClick={this.selectUser} 
            />
        }   
        
      </div>
    );
  }
}

//for redux:
const mapStateToProps = (state) => ({
    objects: state.objects,
    users: state.users
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({  }, dispatch)
});
  
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrentObjectTab);