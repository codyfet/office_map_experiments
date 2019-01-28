import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import UsersList from '../UsersList/index';
import UsersSpecialList from '../UsersSpecialList/index';
import ObjectsList from '../ObjectsList/index';
import './styles.css';
import { TransitionGroup } from 'react-transition-group';
import CreateTab from '../../containers/CreateTab/index';
import CurrentObjectTab from '../../containers/CurrentObjectTab/index';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject } from '../../../actions/index';

// статические данные карты:
import mapData from '../../../res/mapData.json';


class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.levelNum = 1;

    this.state = {
      idCounter: mapData.levels[this.levelNum].movableIdNext,
      selectedObjectId: '',
      selectedUserId: ''
    };
  }
  
  getNewId() {
    const curr_id = this.state.idCounter;
    this.setState({
      idCounter: this.state.idCounter + 1
    });
    return curr_id; 
  }

  getConvertedCoordsFrom(x, y) {
    const { shift, scale } = this.props.boardState;
    console.log('SidePanel', scale, shift);
    
    return { 
      x: (x - shift[0])/scale, 
      y: (y - shift[1])/scale
    };
    
  }

  checkUserAssignedToTable(userId) {
    const { objects } = this.props;
    for ( let obj of objects) {
      if ( obj.userId === userId ) {
        return true;
      }
    }
    return false;
  }

  onSubmitClick = () => {
    const { actions } = this.props;
    const { selectedObjectId, selectedUserId } = this.state;
    
    if ( this.checkUserAssignedToTable(selectedUserId) ) {
      alert("ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ ПРИВЯЗАН К СТОЛУ! Выберите другого пользователя!");
    } else if ( selectedObjectId === '' ) {
      alert("ОШИБКА: ОБЪЕКТ НЕ ВЫБРАН! Выберите объект!");
    } else {
      const newObject = {
        category: selectedObjectId,
        id: this.getNewId(),
        coordinates: this.getConvertedCoordsFrom(750, 20),
        width: 20,
        height: 30,
        userId: selectedUserId
      };
  
      actions.createObject(newObject);
      console.log('created', newObject);
    }

    // подчистить данные:
    this.cleanDataOnSelectedObject();

  }

  cleanDataOnSelectedObject = () => {
    this.setState({
      selectedObjectId: '',
      selectedUserId: ''
    });
  }

  selectObjectId = (id) => {
    this.setState({
      selectedObjectId: id
    });
    console.log('selectedObjectId', id);
  }

  selectUserId = (id) => {
    this.setState({
      selectedUserId: id
    });
    console.log('selectedUserId', id);
  }

  render() {

    const { selectedObjectId } = this.props;

    return (
      <div className="sidePanelContainer">
        {/* accordeon: */}
        <Accordion allowMultiple>
          <AccordionItem 
            title="Current object" 
            expanded={ selectedObjectId !== '' } 
          >
            <CurrentObjectTab selectedObjectId={selectedObjectId}/>
            
          </AccordionItem>
          <AccordionItem title="Create">
            <CreateTab
              searchList={this.props.objects} 
              onObjectClick={this.selectObjectId}
              
              objectId={this.state.selectedObjectId}
              onUserClick={this.selectUserId} 
            />
            <button
              style={{width: '100%'}}
              onClick={this.onSubmitClick}
            >
              Submit
            </button>
          </AccordionItem>
          <AccordionItem title="Users">
            <UsersList />
          </AccordionItem>
          <AccordionItem title="Save map">
            <button
              style={{width: '100%'}}
            >
              Download the current map
            </button>
          </AccordionItem>
        </Accordion>
      </div>
      
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  objects: state.objects,
  boardState: state.boardState,
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createObject }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);