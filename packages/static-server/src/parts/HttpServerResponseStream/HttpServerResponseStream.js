import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

export const send = async (request, socket, filePath) => {
  Assert.object(request)
  Assert.object(socket)
  Assert.string(filePath)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  // TODO etag caching
  response.statusCode = 200
  SetHeaders.setHeaders(response, {
    Connection: 'close',
  })
  const stream = createReadStream(filePath)
  await pipeline(stream, response)
}
