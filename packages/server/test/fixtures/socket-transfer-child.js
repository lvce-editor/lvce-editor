// Delay the handoff acknowledgement so the sender still owns a native handle
// when the peer sends its first request.
const send = process._send
process._send = function (message, ...args) {
  if (message?.cmd === 'NODE_HANDLE_ACK') {
    setTimeout(() => send.call(this, message, ...args), 200)
    return true
  }
  return send.call(this, message, ...args)
}

process.on('message', (_message, socket) => {
  socket.pause()
  socket._handle.readStop()
  socket._handle.reading = false
  socket.write('ready\n')
  // Keep the receiver from winning the competing read while the sender's
  // handle is waiting for its acknowledgement.
  setTimeout(() => {
    socket.on('data', (data) => socket.end(data))
    socket._handle.readStart()
    socket._handle.reading = true
    socket.resume()
  }, 100)
})
