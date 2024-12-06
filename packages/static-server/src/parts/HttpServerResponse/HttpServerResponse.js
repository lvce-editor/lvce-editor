import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'

export const send = (request, socket, result) => {
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
  response.end(result.body)
}
