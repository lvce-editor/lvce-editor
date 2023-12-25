import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'

export const handleRemoteRequest = (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  const response = new ServerResponse(request)
  response.assignSocket(socket)

  response.end('hello world')
}
