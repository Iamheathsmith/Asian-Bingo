import './landing.scss';
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
      redirect: false,
      name: '',
    };
    this.handleMakeRoom = this.handleMakeRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({value: nextProps.value, checked: nextProps.marked});
    }
  }

  handleMakeRoom() {
    this.props.setRoom({isHost: true, hostName: this.state.name});
    this.setState({ redirect: true });
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState({[name]: value});
  };



  render() {
    return (
      <div>
        <h1 className="logo"> The Last Bingo you will ever play!</h1>
        {/* <Nav /> */}
        <div className="input-forms">
          <div className="leftSide">
            <h2 className="welcome left"> Host a Game</h2>
            <input className="left"
              type="text"
              name="name"
              placeholder="host name"
              value={this.state.name}
              onChange={this.handleChange}/>
            <button className="btn-host" onClick={this.handleMakeRoom}>Host Game</button>
          </div>
          <div className="rightSide">
            <h2 className="welcome right"> Join a Game</h2>
            <button className="btn-join"><Link to={'/JoinRoom'}>Join Game</Link></button>
          </div>
        </div>
        {renderIf(this.state.redirect, <Redirect to="/waitingroom" />)}
      </div>
    );
  }
}

let mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
});

export default connect(null, mapDispatchToProps)(Landing);
