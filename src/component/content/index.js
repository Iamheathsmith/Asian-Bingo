
import './content.scss';
import React from 'react';
import Modal from '../modal/index';
import {connect} from 'react-redux';
import Counter from '../count-down/index';
import Check from '../../lib/check-winner';
import { renderIf } from '../../lib/utils';
import DisplayBox from '../display-box/index';
import RandomSpot from '../../lib/random-spot';
import PickRandom from '../../lib/pick-random';
import * as roomBuilder from  '../../action/make-room';

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
    } else {
      this.setState({myTurn: true});
      console.log('SETTING TURN');
    }
  }

  componentDidUpdate() {
    if (this.state.myTurn && !this.state.setup && !this.state.gameOver && !this.state.preGame) {
      this.pickRandom = setTimeout(() => this.handleRandomPlay(this.state.board), 5000);
    }
    if (!this.state.myTurn && this.state.lastPlayed === null) {
      clearTimeout(this.pickRandom);
    }
  }

  componentWillMount() {
    this.socket.on('SWITCH TURNS', data => {
      this.handleUpdateData(data);
      this.setState({ myTurn: true, failed2Play: false });
    });

    this.socket.on('GAME OVER', data => {
      console.log('kill the countdown');
      clearTimeout(this.pickRandom);
      this.setState({gameOver: true, failed2Play: false});
    });

    this.socket.on('WAITING', () => {
      this.setState({preGame: true});
    });

    this.socket.on('RESET', data => {
      this.handleReset();
      if (data !== this.socket.id) {
        this.setState({myTurn: true});
      } else {
        this.setState({myTurn: false});
      }
    });

    this.socket.on('COUNT DOWN', () => {
      this.setState({ counter: true});
    });

    this.socket.on('PLAY GAME', () => {
      if (!this.isHost) {
        this.setState({ setup: false, preGame: false , counter: false});
      } else {
        this.setState({ setup: false, preGame: false , counter: false});
      }
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
      this.socket.emit('GAME WON', this.roomCode, this.socket.id);
      this.setState({winner: true, gameOver: true});
    }
  }

  handleAutoBuild(grid) {
    if (this.state.setup) {
      let newBoard = RandomSpot.getRandom(grid);
      this.setState({board: newBoard, number: 25, setup: false, preGame: true});
      this.socket.emit('READY FOR GAME', this.roomCode);
    }
  }

  handleUpdateData(num) {
    if (!this.state.myTurn) {
      let temp = this.state.board;
      for(let i = 0; i < temp.length; i++) {
        for (let y = 0; y < temp[i].length; y++) {
          if (temp[i][y].val === num) {
            temp[i][y].mark = true;
          }
        }
      }
      return Promise.resolve(this.setState({board: temp}))
        .then(() => {
          this.handleCheckForWinner()
          ;});
    }
  }

  handlePlay(e) {
    if (!this.state.setup && this.state.myTurn) {
      let temp = this.state.board;
      temp[e.location.arr][e.location.idx].mark = true;
      let played = temp[e.location.arr][e.location.idx].val;
      // console.log('PLAYER PLAYED HERE', {i:e.location.arr, y:e.location.idx});
      console.log('PLAYER PLAYED');
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
        <header>Welcome to Bingo! The last game you will ever play?</header>

        <button className="autoBuild" onClick={() => this.handleAutoBuild(this.state.board)}> Auto Build </button>

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
        {/* count down */}
        {renderIf(this.state.counter,
          <Counter />
        )}
        {/* progress bar */}
        {renderIf(this.state.myTurn && !this.state.setup && !this.state.gameOver && !this.state.preGame,
          <div className="progress-bar"><div className="progress"></div></div>
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
  roomBuilder : search => dispatch(roomBuilder.roomSet(search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
