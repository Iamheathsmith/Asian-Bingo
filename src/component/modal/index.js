
import './modal.scss';
import React from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { renderIf } from '../../lib/utils';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.roomCode = this.props.room.roomCode;

    this.state = {
      waiting: this.props.disabledBTN || false,
      gameOver: false,
      redirectToLandingPage: false,
    };
    this.handleUpdateReady = this.handleUpdateReady.bind(this);
    this.handleLeaveGame = this.handleLeaveGame.bind(this);
  }

  componentWillMount() {
    this.socket.on('REDIRECT_ENDGAME', () => {
      this.setState({ redirectToLandingPage: true });
    });

    this.socket.on('GAME_OVER', () => {
      this.setState({ gameOver: true });
    });
  }

  handleUpdateReady() {
    this.socket.emit('RESET GAME', this.roomCode);
    this.setState({waiting: true});
  }

  handleLeaveGame() {
    this.socket.emit('END_GAME', this.roomCode);
  }

  render() {
    return (
      <div className="invis">
        <section className="modal">
          {/* display for end of game with winner/loser */}
          {renderIf(!this.state.waiting && !this.state.gameOver,
            <div className="model-btn">
              <h2>{this.props.winner ? this.props.saying1 : this.props.saying2}</h2>
              <button className="btn" onClick={() => this.handleUpdateReady()}> Play Again? </button>
              <button className="btn" onClick={() => this.handleLeaveGame()}> Leave Game </button>
            </div>
          )}
          {/* display saying for waiting or missed turn */}
          {renderIf(this.state.waiting && !this.state.gameOver,
            <h2>{this.props.saying}</h2>
          )}
          {renderIf(this.state.gameOver,
            <div className="game-over">
              <h2>Everyone Left the Room.</h2>
              <button className="btn" onClick={() => this.handleLeaveGame()}> Leave Game </button>
            </div>
          )}
        </section>
        {renderIf(this.state.redirectToLandingPage, <Redirect to="/" />)}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
});


export default connect(mapStateToProps, null)(Modal);
