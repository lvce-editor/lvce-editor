import { createReadStream } from 'node:fs'
import { ServerResponse } from 'node:http'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { STATIC } from '../Static/Static.js'

export const handleMessageFromParent = async (message, socket) => {
  if (!socket) {
    // socket got closed
    console.log('socket got closed')
    return
  }

  const request = message.params[0]
  const pathname = request.url
  const filePath = join(STATIC, pathname)

  const stream = createReadStream(filePath)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = 200
  // response.setHeader('Connection', 'close')
  await pipeline(stream, response)
  response.detachSocket(socket)
  socket.end()
  // socket.close()
}
