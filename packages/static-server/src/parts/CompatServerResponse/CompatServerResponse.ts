import { ServerResponse, type IncomingMessage, type OutgoingHttpHeaders } from 'node:http'
import type { Socket } from 'node:net'
import type { Writable } from 'node:stream'
import type { Request } from '../Request/Request.ts'

export class CompatServerResponse extends ServerResponse {
  constructor(req: IncomingMessage | Request, socket: Writable, status: number, headers: OutgoingHttpHeaders) {
    super(req as IncomingMessage)
    socket.on('drain', () => {
      this.emit('drain')
    })
    this.assignSocket(socket as Socket)
    this.writeHead(status, headers)
  }
}
