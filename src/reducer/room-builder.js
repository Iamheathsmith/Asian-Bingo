export default (state = null, action) => {
  let { type, payload } = action;

  switch (type) {
  case 'ROOM_SET': {
    return payload;
  }
  case 'UPDATE_ROOM': {
    const updateState = {...state};
    updateState.numPlayers = payload.length;
    updateState.player = payload;
    return updateState;
  }
  case 'UPDATE_WINNER': {
    const updateState = {...state};
    let updatedPlayerList = updateState.player.map(player => player.name === payload ?
      {
        name: player.name,
        wins: player.wins + 1,
      } : player);
    updateState.player = updatedPlayerList;
    return updateState;
  }
  case 'REMOVE_PLAYER': {
    const updateState = {...state};
    let updatedPlayerList = updateState.player.filter(player => player.name !== payload);
    updateState.player = updatedPlayerList;
    updateState.numPlayers = updatedPlayerList.length;
    return updateState;
  }
  case 'ROOM_DELETE': return null;
  default: return state;
  }
};
