import React from 'react';
import ReactDom from 'react-dom';
import App from './component/app';
import io from 'socket.io-client';

ReactDom.render(<App />, document.getElementById('root'));
