import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as SetHeaders from '../SetHeaders/SetHeaders.js'

export const handleRemoteRequest = async (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  response.statusCode = result.init.status
  SetHeaders.setHeaders(response, {
    ...result.init.headers,
    Connection: 'close',
  })
  response.end(result.body)
}
