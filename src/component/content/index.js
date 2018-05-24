
import './content.scss';
import React from 'react';
import Check from '../../lib/check-winner';
import RandomSpot from '../../lib/random-spot';
import {connect} from 'react-redux';
import DisplayBox from '../display-box/index';
import * as locationActions from  '../../action/find-location';

class Content extends React.Component {
  constructor(props) {
    super(props);
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
      winner: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckForWinner = this.handleCheckForWinner.bind(this);
    this.handleAutoBuild = this.handleAutoBuild.bind(this);
  }

  handleCheckForWinner() {
    let checkGame = Check.checkWinner(this.state.board);
    if (checkGame === 'winner') {
      this.setState({winner: true});
      console.log(this.state);
      return;
    }
  }

  handleAutoBuild(grid) {
    let newBoard = RandomSpot.getRandom(grid);
    this.setState({board: newBoard, number: 25, setup: false});
    console.log('inside', this.state);
  }

  handleSubmit(e) {
    if (this.state.setup === true) {
      let value = this.state.number;
      let temp = this.state.board;
      console.log('this is val',value);
      temp[e.location.arr][e.location.idx].val = value;
      console.log('SET UP BOARD', {i:e.location.arr, y:e.location.idx});
      return Promise.resolve(this.setState({board: temp, number: value + 1}))
        .then(() => {
          if (this.state.number > 25) {
            this.setState({setup: false});
          }
        });
    } else {
      let temp = this.state.board;
      temp[e.location.arr][e.location.idx].mark = true;
      console.log('PLAYER PLAYED HERE', {i:e.location.arr, y:e.location.idx});
      return Promise.resolve(this.setState({board: temp}))
        .then(() => {
          this.handleCheckForWinner()
          ;});
    }
  }

  render() {
    return (
      <div className="main">
        <header>Asian Bingo! was his name O!</header>

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
              />;
            });
          })
          }
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  location: state.location,
});

const mapDispatchToProps = dispatch => ({
  addLocation : search => dispatch(locationActions.addLocationAction(search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
