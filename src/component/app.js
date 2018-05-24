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

export default class App extends React.Component {

  render() {
    return (
      <main className="application">
        <Provider store={store}>
          <BrowserRouter>
            <React.Fragment>
              <Route exact path="/game" component={Content}/>
              <Route exact path="/" component={Landing}/>
              <Route exact path="/WaitingRoom" component={WaitingRoom}/>
              <Route exact path="/JoinRoom" component={JoinRoom}/>
            </React.Fragment>
          </BrowserRouter>
        </Provider>
      </main>
    );
  }
}
