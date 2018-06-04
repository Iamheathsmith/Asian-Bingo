export const socketSet = socket => ({
  type: 'SOCKET_SET',
  payload: socket,
});

export const socketDelete = () => {
  return {
    type: 'SOCKET_DELETE',
  };
};
