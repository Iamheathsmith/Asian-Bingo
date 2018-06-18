
import './content.scss';
import React from 'react';
import Timer from '../timer/index';
import Modal from '../modal/index';
import {connect} from 'react-redux';
import Counter from '../count-down/index';
import Check from '../../lib/check-winner';
import { renderIf } from '../../lib/utils';
import DisplayBox from '../display-box/index';
import RandomSpot from '../../lib/random-spot';
import PickRandom from '../../lib/pick-random';
import * as roomActions from '../../action/make-room';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.roomCode = this.props.room.roomCode;
    this.isHost = this.props.room.isHost;

    this.state = {
      board: [
        [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
        [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
        [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
        [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
        [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
      ],
      number: 1,
      setup: true,
      myTurn: false,
      winner: false,
      gameOver: false,
      preGame: false,
      lastPlayed: null,
      counter: false,
      failed2Play: false,
      everyOneLeft: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleCheckForWinner = this.handleCheckForWinner.bind(this);
    this.handleAutoBuild = this.handleAutoBuild.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handleRandomPlay = this.handleRandomPlay.bind(this);
  }

  componentDidMount() {
    if (this.isHost) {
      this.socket.emit('REDIRECT_PLAYERS', this.roomCode, '/game');
      if (this.props.room.numPlayers > 2) {
        this.setState({myTurn: true});
      }
    } else if (this.props.room.numPlayers < 3) {
      this.setState({myTurn: true});
    }
  }

  componentDidUpdate() {
    clearTimeout(this.pickRandom);
    if (this.state.myTurn && !this.state.setup && !this.state.gameOver && !this.state.preGame) {
      this.pickRandom = setTimeout(() => this.handleRandomPlay(this.state.board), 15000);
    }
    if (!this.state.myTurn && this.state.lastPlayed === null) {
      clearTimeout(this.pickRandom);
    }
  }

  componentWillMount() {
    this.socket.on('SWITCH TURNS', (data, nextGo) => {
      console.log('data', data);
      console.log('nextGo', nextGo);
      this.handleUpdateData(data, nextGo);
    });

    this.socket.on('REMOVE_PLAYER', name => {
      this.props.removePlayer(name, this.socket);
      if (this.props.room.player.length < 2) {
        this.setState({everyOneLeft: true});
      }
    });

    this.socket.on('GAME OVER', name => {
      clearTimeout(this.pickRandom);
      this.props.updateWinner(name);
      this.setState({gameOver: true, failed2Play: false});
    });

    this.socket.on('WAITING', () => {
      this.setState({preGame: true});
    });

    this.socket.on('RESET', data => {
      this.handleReset();
      if (this.props.room.player.length === 2) {
        if (data !== this.socket.id) {
          this.setState({myTurn: true});
        } else {
          this.setState({myTurn: false});
        }
      } else {
        if (this.isHost) {
          this.setState({myTurn: true});
        } else {
          this.setState({myTurn: false});
        }
      }
    });

    this.socket.on('COUNT DOWN', () => {
      this.setState({ counter: true});
    });

    this.socket.on('PLAY GAME', () => {
      this.setState({ setup: false, preGame: false , counter: false});
    });
  }

  handleRandomPlay(grid) {
    let randoPick = PickRandom.pickRandom(grid);
    let temp = this.state.board;
    temp[randoPick.i][randoPick.y].mark = true;
    let played = temp[randoPick.i][randoPick.y].val;
    return Promise.resolve(this.setState({board: temp, myTurn: false, lastPlayed: played, failed2Play: true}))
      .then(() => {
        this.handleCheckForWinner();
        ;})
      .then(() => {
        if (!this.state.winner) {
          clearTimeout(this.pickRandom);
          this.socket.emit('NEXT TURN', this.state.lastPlayed, this.roomCode);
        }
      });
  }


  handleReset() {
    if (this.state.gameOver) {
      this.setState({
        board: [
          [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
          [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
          [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
          [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
          [{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false},{val:'', mark: false}],
        ],
        number: 1,
        setup: true,
        myTurn: false,
        winner: false,
        gameOver: false,
        preGame: false,
        lastPlayed: null,
        counter: false,
        failed2Play: false,
      });
    };
  }


  handleCheckForWinner() {
    let checkGame = Check.checkWinner(this.state.board);
    if (checkGame === 'winner') {
      console.log('FOUND WINNER', this.socket.id);
      this.setState({winner: true, gameOver: true});
      this.socket.emit('GAME WON', this.roomCode, this.socket.id, this.props.room.nickname);
    }
  }

  handleAutoBuild(grid) {
    if (this.state.setup) {
      let newBoard = RandomSpot.getRandom(grid);
      return Promise.resolve(this.setState({board: newBoard, number: 25, setup: false, preGame: true}))
        .then(() => {
          this.socket.emit('READY FOR GAME', this.roomCode);
        });
    }
  }

  handleUpdateData(num, nextGo) {
    if (!this.state.myTurn) {
      let temp = this.state.board;
      if (num !== undefined) {
        for(let i = 0; i < temp.length; i++) {
          for (let y = 0; y < temp[i].length; y++) {
            if (temp[i][y].val === num) {
              temp[i][y].mark = true;
            }
          }
        }
      }
      if (this.props.room.numPlayers > 2) {
        if (nextGo === this.socket.id) {
          return Promise.resolve(this.setState({board: temp, myTurn: true, failed2Play: false }))
            .then(() => {
              this.handleCheckForWinner()
              ;});
        } else {
          return Promise.resolve(this.setState({board: temp, myTurn: false, failed2Play: false }))
            .then(() => {
              this.handleCheckForWinner()
              ;});
        }
      } else {
        return Promise.resolve(this.setState({board: temp, myTurn: true, failed2Play: false }))
          .then(() => {
            this.handleCheckForWinner()
            ;});
      }

    }
  }

  handlePlay(e) {
    if (!this.state.setup && this.state.myTurn) {
      let temp = this.state.board;
      temp[e.location.arr][e.location.idx].mark = true;
      let played = temp[e.location.arr][e.location.idx].val;
      console.log('PLAYER PLAYED, UPDATE ON STATE');
      return Promise.resolve(this.setState({board: temp, myTurn: false, lastPlayed: played}))
        .then(() => {
          this.handleCheckForWinner();
          ;})
        .then(() => {
          if (!this.state.winner) {
            clearTimeout(this.pickRandom);
            this.socket.emit('NEXT TURN', this.state.lastPlayed, this.roomCode);
          }
        });
    }
  }

  handleSubmit(e) {
    let value = this.state.number;
    let temp = this.state.board;
    temp[e.location.arr][e.location.idx].val = value;
    return Promise.resolve(this.setState({board: temp, number: value + 1}))
      .then(() => {
        if (this.state.number === 26) {
          this.socket.emit('READY FOR GAME', this.roomCode);
        }
      });
  }

  render() {
    return (
      <div className="main">
        <header>get ready to play!</header>

        <div className="game-area">
          <button className="autoBuild" onClick={() => this.handleAutoBuild(this.state.board)}> Auto Build </button>

          <div className="scores">
            {this.props.room.player.map((item, key) => {
              return <h3 className="playerScore"key={key}>{item.name}: {item.wins}</h3>;
            })
            }
          </div>

          {renderIf(this.state.myTurn && !this.state.setup && !this.state.gameOver && !this.state.preGame,
            <Timer
              setTime={15}
            />
          )}

          {/* build the board */}
          <div className="boxes">
            {this.state.board.map((item, arr) => {
              return item.map((item, idx) => {
                return <DisplayBox key={idx}
                  boxLocation={{arr,idx}}
                  marked={this.state.board[arr][idx].mark}
                  value={this.state.board[arr][idx].val}
                  onPicking={this.handleSubmit}
                  onPlay={this.handlePlay}
                />;
              });
            })
            }
          </div>
        </div>

        {/* for winner/loser */}
        {renderIf(this.state.gameOver,
          <Modal className="modal-1"
            saying1='congrats you win!'
            saying2='sorry you lose!'
            winner={this.state.winner}
          />
        )}
        {/* stand by for players */}
        {renderIf(this.state.preGame && !this.state.counter,
          <Modal className="modal-2"
            saying='Waiting on other Players!'
            disabledBTN={true}
          />
        )}
        {/* failed to play */}
        {renderIf(this.state.failed2Play && !this.state.gameOver,
          <Modal className="modal-3"
            disabledBTN={true}
            saying='You Missed your turn, make sure you click something'
          />
        )}
        {renderIf(this.state.everyOneLeft,
          <Modal className="modal-4"
            everyOneLeft={true}
            // saying='Everyone Left, return to Home page'
          />
        )}
        {/* count down */}
        {renderIf(this.state.counter,
          <Counter />
        )}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
});

const mapDispatchToProps = dispatch => ({
  updateWinner: name => dispatch(roomActions.updateWinner(name)),
  removePlayer: name => dispatch(roomActions.removePlayer(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
