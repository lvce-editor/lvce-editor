import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRemoteRequest = async (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, result)
}
