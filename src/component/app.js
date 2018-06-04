import '../style/base/_reset.scss';
import '../style/main.scss';

import React from 'react';
import Content from './content';
import Landing from './landing';
import WaitingRoom from './waiting-room';
import JoinRoom from './join-room';
import {Provider} from 'react-redux';
import createStore from '../lib/app-create-store';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';


const store = createStore();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
    };
  }

  componentDidMount() {
    console.log('I am in the APP');
    if (this.props.socket)
      store.dispatch({ type: 'SOCKET_SET', payload: this.props.socket });
  }

  render() {
    return (
      <main className="application">
        <Provider store={store}>
          <BrowserRouter>
            <React.Fragment>
              <Route exact path="/" component={Landing}/>
              <Route exact path="/game" component={() => store.getState().socket ? <Content /> : <Redirect to="/" />}/>
              <Route exact path="/WaitingRoom" component={() => store.getState().socket ? <WaitingRoom /> : <Redirect to="/" />}/>
              <Route exact path="/JoinRoom" component={() => store.getState().socket ? <JoinRoom /> : <Redirect to="/" />}/>
            </React.Fragment>
          </BrowserRouter>
        </Provider>
      </main>
    );
  }
}

export default App;
