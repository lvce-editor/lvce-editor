import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'

export const handleRemoteRequest = async (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url)
  response.statusCode = result.init.status
  for (const [key, value] of Object.entries(result.init.headers)) {
    response.setHeader(key, value)
  }
  response.setHeader('Connection', 'close')
  response.end(result.body)
}
