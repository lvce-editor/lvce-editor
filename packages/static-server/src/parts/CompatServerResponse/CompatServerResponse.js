import { ServerResponse } from 'node:http'

export class CompatServerResponse extends ServerResponse {
  constructor(req, socket) {
    super(req)
    socket.on('drain', () => {
      this.emit('drain')
    })
  }
}
