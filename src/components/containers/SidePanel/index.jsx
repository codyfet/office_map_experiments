import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import UsersList from '../UsersList/index';
import UsersSpecialList from '../UsersSpecialList/index';
import ObjectsList from '../ObjectsList/index';
import './styles.css';
import { TransitionGroup } from 'react-transition-group';
import CreateTab from '../../containers/CreateTab/index';

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

    return (
      <div className="sidePanelContainer">
        {/* accordeon: */}
        <Accordion>
          <AccordionItem title="Current object" expanded={true} >
            <div style={{width: '100%', display: 'flex'}}>
              ...
            </div>
          </AccordionItem>
          <AccordionItem title="Create">
            <CreateTab
              searchList={this.props.objects} 
              onObjectClick={this.selectObjectId}
              
              objectId={this.state.selectedObjectId}
              onUserClick={this.selectUserId} 
            />
            {/* <Accordion 
              className="innerAccordion"
              allowMultiple={true} 
            >
              <AccordionItem 
                titleClassName="innerAccordion-item-title"
                bodyClassName="innerAccordion-item-body-wrapper"
                expandedClassName="innerAccordion-item-expanded"
                disabledClassName="innerAccordion-item-title"
              >
                <ObjectsList 
                  searchList={this.props.users} 
                  onObjectClick={this.selectObjectId}
                />
              </AccordionItem>
                
              <AccordionItem>
                <UsersSpecialList
                  className={this.state.selectedObjectId === 'table' ? "show" : "userSpecialListWrapper"}
                  onUserClick={this.selectUserId}
                />
              </AccordionItem>
            </Accordion > */}
            {/* <div style={{width: '100%', 
                         height: '280px', 
                         display: 'flex', 
                         flexDirection: 'column',
                         justifyContent: 'center',
                         alignItems: 'center'}}
            >
              <ObjectsList 
                searchList={this.props.users} 
                onObjectClick={this.selectObjectId}
              />
              <UsersSpecialList
                className={this.state.selectedObjectId === 'table' ? "show" : "userSpecialListWrapper"}
                onUserClick={this.selectUserId}
              />
            </div> */}
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