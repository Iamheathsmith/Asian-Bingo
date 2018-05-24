export default (state=[], {type, payload}) => {

  switch (type) {
  case 'ADD_LOCATION':
    state = [];
    return [... state, payload.forecast];
  default:
    return state;
  }
};
