import * as React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';
import UsersSpecialList from '../UsersSpecialList/index';
import ObjectsList from '../ObjectsList/index';
import './styles.css';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeCurrentObject, changeCurrentUser } from '../../../actions/index';

class CreateTab extends React.Component {

  render() {

    const { onObjectClick, objectId, onUserClick } = this.props;

    return (
      <Accordion allowMultiple>
        <AccordionItem
          title="Choose object" 
          expanded="true"
          duration={300}  
        >
          <ObjectsList 
            onObjectClick={onObjectClick}
          />
        </AccordionItem>
        <AccordionItem 
          title="Choose user"
          expanded={objectId === 'table'}
          duration={300}
        >
          { 
            objectId === 'table' &&
            <UsersSpecialList
                onUserClick={onUserClick}
            />
          }
          { 
            objectId !== 'table' &&
            <div>
                <p className="chooseUserText">You couldn't add User to this object!</p>
            </div>
          }
          
        </AccordionItem>
      </Accordion >
    );
  }
}

// for redux:
const mapStateToProps = (state) => ({
  currentObject: state.currentObject,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ changeCurrentObject, changeCurrentUser }, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTab);