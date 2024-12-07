import { ServerResponse } from 'node:http'

export class CompatServerResponse extends ServerResponse {
  constructor(req, socket, status, headers) {
    super(req)
    socket.on('drain', () => {
      this.emit('drain')
    })
    this.assignSocket(socket)
    this.writeHead(status, headers)
  }
}
