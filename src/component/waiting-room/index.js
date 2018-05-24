import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { renderIf } from '../../lib/utils';



class Waitingroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: 1,
      roomCode: null,
      playerNames: ['heath'],
      redirectToGameView: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div id="waitingroom-wrapper">
          <div className="waitingroom-header">
            <h1>Waiting Room</h1>
          </div>

          <table className="waitingroom-table">
            <tbody>
              <tr>
                <td className="left">Room Code</td>
                <td className="right secondary-color">test code here</td>
              </tr>
              <tr>
                <td className="left"># Players</td>
                <td className="right secondary-color">{this.state.numPlayers}</td>
              </tr>
              <tr>
                <td className="left">Players</td>
                <td className="right secondary-color">{this.state.playerNames}</td>
              </tr>
              <tr>
                <td colSpan="2" className="left secondary-color">{renderIf(this.state.numPlayers === 0, 'None yet!')} {this.state.playerNames.join(', ')}</td>
              </tr>
            </tbody>
          </table>

          <br /><br />

          {/* {renderIf(this.isHost && this.state.numPlayers > 0, <Link to={'/game'}> */}
          {renderIf(this.state.numPlayers > 0, <Link to={'/game'}>
            <button type="button" className="startgame-button submit" id="start-game">Start Game</button>
          </Link>)}

          {renderIf(this.isHost && !this.state.numPlayers, <span className="tooltip">Waiting for players to join...</span>)}

          {renderIf(!this.isHost, <span className="tooltip">Waiting for host to start game...</span>)}

          {renderIf(this.state.redirectToGameView, <Redirect to="/game" />)}



        </div>
      </React.Fragment>
    );
  }
}


export default Waitingroom;
