import React from 'react';
import {Link} from 'react-router-dom';
// import './nav.scss';

class Nav extends React.Component {

  render() {
    return (
      <div className="nav">
        <span>Bingo!</span>
        <div className="navStuff">
          <Link to={'/game'} className="home">Home</Link>
        </div>
      </div>
    );
  }
}


export default Nav;
