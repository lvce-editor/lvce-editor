export const destroySocket = (socket: any): any => {
  try {
    socket.destroy()
  } catch {}
}
