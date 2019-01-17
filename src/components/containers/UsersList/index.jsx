import * as React from 'react';
import MultiColorSVG from '../../presentational/MultiColorSVG/index';
import iconPaths from '../../../res/iconPaths';

// redux:
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUser, editUser, deleteUser } from '../../../actions/index';


class UsersList extends React.Component {
  
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
            <React.Fragment>
                <ul>
                    {loadUsers}
                </ul>
                <button className="stretched">
                    Add user
                </button>    
            </React.Fragment>
             
        );
    }
};

// for redux:
const mapStateToProps = (state) => ({
    users: state.users
});
  
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ addUser, editUser, deleteUser }, dispatch)
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersList);