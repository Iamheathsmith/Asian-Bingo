import React from 'react';
import Nav from '../nav/index';
import Test from '../build-game/index';
import { Link } from 'react-router-dom';
// import './input-area.scss';

class Landing extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     location: this.props.boxLocation,
  //     value:  this.props.value || '',
  //     checked: this.props.marked || false,
  //   };
  //   this.handleCheckState = this.handleCheckState.bind(this);
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({value: nextProps.value, checked: nextProps.marked});
    }
  }


  render() {
    return (
      <div>
        <Nav />
        <h2 className="welcome"> welcome to Asian Bingo</h2>
        <button className="btn-host"><Link to={'/WaitingRoom'}>Host Game</Link></button>
        <button className="btn-join"><Link to={'/JoinRoom'}>Join Game</Link></button>
      </div>
    );
  }
}


export default Landing;
