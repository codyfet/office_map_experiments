import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import UsersList from '../UsersList/index';
import UsersSpecialList from '../UsersSpecialList/index';
import ObjectsList from '../ObjectsList/index';
import './styles.css';

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

  handleClick = () => {
    const { actions } = this.props;
    
    const newObject = {
      category: 'table',
      id: this.getNewId(),
      coordinates: this.getConvertedCoordsFrom(750, 20),
      width: 20,
      height: 30
    };

    actions.createObject(newObject);
    console.log('created', newObject);
    
  }

  selectObjectId = (id) => {
    this.setState({
      selectedObjectId: id
    });
  }

  render() {

    return (
      <div className="sidePanelContainer">
        <button 
          style={{width: '100%'}}
          onClick={this.handleClick}
        >
          Create
        </button>
        {/* accordeon: */}
        <Accordion>
          <AccordionItem title="Current object" expanded={true} >
            <div style={{width: '100%', display: 'flex'}}>
              ...
            </div>
          </AccordionItem>
          <AccordionItem title="Create">
            <div style={{width: '100%', 
                         height: '250px', 
                         display: 'flex', 
                         flexDirection: 'column', 
                         justifyContent: 'center',
                         alignItems: 'center'}}>
              <ObjectsList 
                searchList={this.props.users} 
                onObjectClick={this.selectObjectId}
              />
              { this.state.selectedObjectId !== '' &&
                <UsersSpecialList />
              }
            </div>
            <button
              style={{width: '100%'}}
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