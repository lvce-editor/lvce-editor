import * as DestroySocket from '../DestroySocket/DestroySocket.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const rejectWebSocket = (socket: any): any => {
  socket.write(`HTTP/1.1 ${HttpStatusCode.Forbidden} Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
  if (typeof socket.end === 'function') {
    socket.end()
    return
  }
  DestroySocket.destroySocket(socket)
}
