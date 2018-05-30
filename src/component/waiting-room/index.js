import React from 'react';
import { connect } from 'react-redux';
import { renderIf } from '../../lib/utils';
import { Redirect, Link } from 'react-router-dom';
import * as roomActions from '../../action/make-room';
import * as socketActions from '../../action/socket-actions';



class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.isHost = this.props.room.isHost;


    this.state = {
      numPlayers: 0,
      roomCode: null,
      playerNames: [],
      redirectToGameView: false,
    };
  }

  componentWillMount() {
    // if isHost is true
    if (this.isHost) {
      // creating a room
      this.socket.emit('CREATE_ROOM', this.game, this.instance);

      // receiving a room w/code back from back end
      this.socket.on('SEND_ROOM', data => {
        data = JSON.parse(data);
        let {roomCode, game, maxPlayers, roomHost} = data;

        this.props.setRoom({
          roomCode: roomCode,
          isHost: this.isHost,
          numPlayers: maxPlayers,
          roomHost: roomHost,
        });

        this.setState({roomCode: roomCode});

        this.socket.room = roomCode;
        let socket = this.socket;

        this.props.setSocket(socket);

        console.log('__ROOM_CODE__', this.props.room.roomCode);
      });
    }

    // update number of players in waiting room
    this.socket.on('TRACK_PLAYERS', (num, names) => {
      this.setState({
        numPlayers: num,
        playerNames: names,
      });
    });

    // listens for when host clicks start game, redirects players to gameview
    this.socket.on('REDIRECT', path => {
      this.setState({ redirectToGameView: true });
    });

    // // if the host disconnects, redirects to errorview
    // this.socket.on('REDIRECT_DISCONNECT', () => {
    //   this.setState({ redirectToErrorView: true });
    // });
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
                <td className="right secondary-color">:  {this.props.room.roomCode}</td>
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

          {renderIf(this.isHost && this.state.numPlayers > 0, <Link to={{ pathname: '/game' }}>
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

let mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
});

let mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
  setSocket: socket => dispatch(socketActions.socketSet(socket)),
});


export default connect(mapStateToProps, mapDispatchToProps)(WaitingRoom);
