export const sendSocket = (childProcess, message, socket) => {
  socket.pause()
  const handle = socket._handle
  if (handle) {
    // pause() stops stream delivery, but can leave the native read active.
    // send() discards reads on the parent's handle until the child acknowledges
    // the transfer, so stop that read before the peer can send its first frame.
    const status = handle.readStop()
    if (status !== 0) {
      socket.destroy()
      throw new Error(`Unable to stop socket reads before transfer (${status})`)
    }
    handle.reading = false
  }
  childProcess.send(message, socket, { keepOpen: false })
}
