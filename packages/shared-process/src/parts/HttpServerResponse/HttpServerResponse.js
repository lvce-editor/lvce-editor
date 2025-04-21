import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'

const handleResponseError = (error) => {
  console.error(`[shared-process] Failed to send response ${error}`)
}

export const send = async (request, socket, result) => {
  Assert.object(request)
  Assert.object(socket)
  Assert.object(result)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = result.init.status
  SetHeaders.setHeaders(response, {
    ...result.init.headers,
    Connection: 'close',
  })

  // TODO use promises if possible
  socket.on('error', handleResponseError)
  response.end(result.body)
}
