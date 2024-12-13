import { ServerResponse } from 'node:http'
import * as Connection from '../Connection/Connection.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'

export const send = (request, socket, result) => {
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = result.init.status
  SetHeaders.setHeaders(response, {
    ...result.init.headers,
    Connection: Connection.Close,
  })
  response.end(result.body)
}
