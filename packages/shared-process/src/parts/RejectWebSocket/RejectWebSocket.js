import * as DestroySocket from '../DestroySocket/DestroySocket.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const rejectWebSocket = (socket) => {
  socket.write(`HTTP/1.1 ${HttpStatusCode.Forbidden} Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
  if (typeof socket.end === 'function') {
    socket.end()
    return
  }
  DestroySocket.destroySocket(socket)
}
