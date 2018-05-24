import React from 'react';
import './input-area.scss';

class DisplayBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.boxLocation,
      value:  this.props.value || '',
      checked: this.props.marked || false,
    };
    this.handleCheckState = this.handleCheckState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({value: nextProps.value, checked: nextProps.marked});
    }
  }

  handleCheckState() {
    this.state.value === '' ? this.props.onPicking(this.state) : this.state.checked === false ? this.props.onPicking(this.state) : null;
  }


  render() {
    return (
      <div className={this.state.checked === true ? 'box' : 'box4'}
        onClick={() => this.handleCheckState()}>
        <h1 className="num"> {this.state.value} </h1>
      </div>
    );
  }
}


export default DisplayBox;
