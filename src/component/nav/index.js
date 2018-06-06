import React from 'react';
import {Link} from 'react-router-dom';
import './nav.scss';

class Nav extends React.Component {

  render() {
    return (
      <div className="header">
        <h1 className="logo">Bingo!</h1>
        <h3 className="saying"> Watch what you pick, it might be your LAST!</h3>
      </div>
    );
  }
}


export default Nav;
