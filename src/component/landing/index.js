import React from 'react';
import Nav from '../nav/index';
import { connect } from 'react-redux';
import { renderIf } from '../../lib/utils';
import { Link, Redirect } from 'react-router-dom';
import * as roomActions from  '../../action/make-room';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isHost: true,
      redirect: false,
    };
    this.handleMakeRoom = this.handleMakeRoom.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({value: nextProps.value, checked: nextProps.marked});
    }
  }

  handleMakeRoom() {
    this.props.setRoom({
      isHost: true,
    });

    this.setState({ redirect: true });
  }


  render() {
    return (
      <div>
        <Nav />
        <h2 className="welcome"> welcome to Bingo</h2>
        <button className="btn-host" onClick={this.handleMakeRoom}>Host Game</button>
        <button className="btn-join"><Link to={'/JoinRoom'}>Join Game</Link></button>

        {renderIf(this.state.redirect, <Redirect to="/waitingroom" />)}
      </div>
    );
  }
}

let mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
});

export default connect(null, mapDispatchToProps)(Landing);
