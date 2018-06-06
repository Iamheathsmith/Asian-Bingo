
import './timer.scss';
import React from 'react';
import {connect} from 'react-redux';
import { renderIf } from '../../lib/utils';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.setTime || 15,
    };
    this.handleCounter = this.handleCounter.bind(this);
  }

  componentDidMount(){
    this.counter = setInterval( () =>{
      this.handleCounter();
      if (this.state.time === 0) {
        clearInterval(this.counter);
      }
    },
    1000);
  };

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  handleCounter() {
    let time = this.state.time;
    if(time > 0){
      this.setState({time: time - 1});
    }
  }

  render() {
    return (
      <div className="timmer-holder">
        {renderIf(this.state.time > 0,
          <h2 className="timmer">{this.state.time}</h2>
        )}
      </div>
    );
  }
}


export default Timer;
