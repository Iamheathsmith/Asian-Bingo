export const roomSet = room => ({
  type: 'ROOM_SET',
  payload: room,
});

export const updateRoom = room => ({
  type: 'UPDATE_ROOM',
  payload: room,
});

export const updateWinner = name => ({
  type: 'UPDATE_WINNER',
  payload: name,
});

export const removePlayer = name => ({
  type: 'REMOVE_PLAYER',
  payload: name,
});

export const roomDelete = () => {
  return {
    type: 'ROOM_DELETE',
  };
};
