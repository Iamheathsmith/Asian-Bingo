
import './content.scss';
import React from 'react';
import Modal from '../modal/index';
import {connect} from 'react-redux';
import Counter from '../count-down/index';
import Check from '../../lib/check-winner';
import { renderIf } from '../../lib/utils';
import DisplayBox from '../display-box/index';
import RandomSpot from '../../lib/random-spot';
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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleCheckForWinner = this.handleCheckForWinner.bind(this);
    this.handleAutoBuild = this.handleAutoBuild.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handlePlayAgain = this.handlePlayAgain.bind(this);
  }

  componentDidMount() {
    if (this.isHost) {
      this.socket.emit('REDIRECT_PLAYERS', this.roomCode, '/game');
    } else {
      this.setState({myTurn: true});
    }
  }

  componentWillMount() {
    this.socket.on('SWITCH TURNS', data => {
      this.handleUpdateData(data);
      this.setState({ myTurn: true });
    });

    this.socket.on('GAME OVER', data => {
      this.setState({gameOver: true });
    });

    this.socket.on('RESET', () => {
      if (!this.state.winner) {
        this.setState({ myTurn: true });
      };
      this.handleReset();
    });

    this.socket.on('COUNT DOWN', () => {
      this.setState({ counter: true});
    });

    this.socket.on('PLAY GAME', () => {
      if (!this.isHost) {
        this.setState({ setup: false, preGame: false , counter: false, myTurn: true});
      } else {
        this.setState({ setup: false, preGame: false , counter: false});
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
      });
    };
  }

  handlePlayAgain() {
    console.log('inside playagain');
    let goFirst = this.state.winner;
    this.handleReset();
    console.log('this is goFrist', goFirst);
    if (!this.isHost) {
      this.setState({ myTurn: true });
      this.socket.emit('REDIRECT_PLAYERS', this.roomCode, '/game');
    };
  }

  handleCheckForWinner() {
    let checkGame = Check.checkWinner(this.state.board);
    if (checkGame === 'winner') {
      this.socket.emit('GAME WON', this.roomCode);
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
            console.log('found it');
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
      console.log('PLAYER PLAYED HERE', {i:e.location.arr, y:e.location.idx});
      return Promise.resolve(this.setState({board: temp, myTurn: false, lastPlayed: played}))
        .then(() => {
          this.handleCheckForWinner()
          ;})
        .then(() => {
          if (!this.state.winner) {
            this.socket.emit('NEXT TURN', this.state.lastPlayed, this.roomCode);
          }
        });
    }
  }

  handleSubmit(e) {
    let value = this.state.number;
    let temp = this.state.board;
    temp[e.location.arr][e.location.idx].val = value;
    console.log('SET UP BOARD', {i:e.location.arr, y:e.location.idx});
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
        <header>Welcome to Bingo! or was it it his name O?</header>

        <div className="name-search">

        </div>

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
          <Modal
            saying1='congrats you win!'
            saying2='sorry you lose!'
            winner={this.state.winner}
          />
        )}
        {/* stand by for players */}
        {renderIf(this.state.preGame && !this.state.counter,
          <Modal
            saying2='Get ready to play!'
            disabledBTN={true}
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
  peopleInGame: state.peopleInGame,
});

const mapDispatchToProps = dispatch => ({
  roomBuilder : search => dispatch(roomBuilder.roomSet(search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
