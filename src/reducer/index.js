
import sockets from './sockets';
import {combineReducers} from 'redux';
import roomBuilder from './room-builder';

export default combineReducers({
  room: roomBuilder,
  socket: sockets,
});
