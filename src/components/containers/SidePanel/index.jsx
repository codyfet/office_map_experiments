import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import MultiColorSVG from '../../presentational/MultiColorSVG/index';
import iconPaths from '../../../res/iconPaths';
import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createObject, addUser, editUser, deleteUser } from '../../../actions/index';

// статические данные карты:
import mapData from '../../../res/mapData.json';

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.levelNum = 1;

    this.state = {
      idCounter: mapData.levels[this.levelNum].movableIdNext
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
      type: 'table',
      id: this.getNewId(),
      coordinates: this.getConvertedCoordsFrom(750, 20),
      width: 20,
      height: 30
    };

    actions.createObject(newObject);
    console.log('created', newObject);
    
  }

  render() {
    
    const loadUsers = this.props.users.map((val, i) => {
      return (
        <li key={i}>
          <div className="userItem">
            <MultiColorSVG
              width="30px"
              fill={['#E7ECED', /*'#556080'*/'#F9BF05']}
              content={iconPaths.user}
            />
            <div className="userInfo">
              <div>{val.title}</div>
              <div>{val.capability}</div>
            </div>
          </div> 
          
        </li>
      );
    });

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
          <AccordionItem title="Current object">
            <div style={{width: '100%', display: 'flex'}}>
              ...
            </div>
          </AccordionItem>
          <AccordionItem title="Create">
            <div style={{width: '100%', height: '150px', display: 'flex', textAlign: 'center'}}>
                <div style={{width: '50%'}}>
                  TypoidObject
                </div>
                <div style={{width: '50%'}}>
                  TypoidUser
                </div>
            </div>
            <button
              style={{width: '100%'}}
            >
              Submit
            </button>
          </AccordionItem>
          <AccordionItem title="Users">
            <ul>
                {loadUsers}
            </ul>
            <button
              style={{width: '100%'}}
            >
                  Add user
            </button>
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
  actions: bindActionCreators({ createObject, addUser }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);