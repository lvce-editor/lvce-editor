import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRemoteRequest = async (socket, request) => {
  Assert.object(socket)
  Assert.object(request)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, result)
}
