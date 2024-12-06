import { join } from 'node:path'
import * as HttpServerResponseStream from '../HttpServerResponseStream/HttpServerResponseStream.js'
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
  await HttpServerResponseStream.send(request, socket, filePath)
}
