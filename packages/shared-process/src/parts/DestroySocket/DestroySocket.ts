export const destroySocket = (socket) => {
  try {
    socket.destroy()
  } catch {}
}
