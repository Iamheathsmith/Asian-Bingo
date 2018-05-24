
import {combineReducers} from 'redux';
import addLocation from './addLocation';

export default combineReducers({
  location: addLocation,
});
