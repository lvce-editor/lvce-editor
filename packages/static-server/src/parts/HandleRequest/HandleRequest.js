import { join } from 'node:path'
import * as HttpServerResponseStream from '../HttpServerResponseStream/HttpServerResponseStream.js'
import { STATIC } from '../Static/Static.js'

export const handleRequest = async (request, socket) => {
  const pathname = request.url
  const filePath = join(STATIC, pathname)
  await HttpServerResponseStream.send(request, socket, filePath)
}
