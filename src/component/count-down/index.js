
import './modal.scss';
import React from 'react';
import {connect} from 'react-redux';
import { renderIf } from '../../lib/utils';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.roomCode = this.props.room.roomCode;

    this.state = {
      time: 3,
    };
    this.handleCounter = this.handleCounter.bind(this);
  }

  componentDidMount(){
    console.log('inside the mount');
    this.counter = setInterval( () =>{
      console.log('going again', this.state.time);
      this.handleCounter();
      if (this.state.time === 0) {
        clearInterval(this.counter);
        this.socket.emit('START GAME', this.roomCode);
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
      console.log('inside handlecounter',time);
      this.setState({time: time - 1});
    }
  }

  render() {
    return (
      <div className="invis">
        <section className="modal">
          {renderIf(this.state.time > 0,
            <h2 className="counter">{this.state.time}</h2>
          )}
        </section>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
});


export default connect(mapStateToProps, null)(Counter);
