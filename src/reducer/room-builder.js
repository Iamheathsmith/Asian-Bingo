export default (state = null, action) => {
  let { type, payload } = action;

  switch (type) {
  case 'ROOM_SET': return payload;
  case 'ROOM_DELETE': return null;
  default: return state;
  }
};
