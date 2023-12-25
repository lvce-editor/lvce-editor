import { createServer } from 'http'
import * as Assert from '../Assert/Assert.js'
import { ServerResponse } from 'http'
import { Socket } from 'net'

export const handleRemoteRequest = (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  console.log(socket)
  // if (!request.url) {
  // console.log(request)
  // }

  // socket.statusCode = 200
  // request.socket = socket
  // const c = createServer((req, res) => {
  //   res.end('finish')
  // })
  // c.listen(0)
  // c.emit('connection', socket)
  // c.emit
  // const a = new ServerResponse(request)
  // a.statusCode = 200
  // a.end('ok')

  // console.log({ a })
  socket.end('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nHello')
  // socket.write('abc')
  // socket.end('ok')
  // console.log({ request, socket })
}
