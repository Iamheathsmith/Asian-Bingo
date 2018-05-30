export const roomSet = room => ({
  type: 'ROOM_SET',
  payload: room,
});

export const roomDelete = () => {
  return {
    type: 'ROOM_DELETE',
  };
};
