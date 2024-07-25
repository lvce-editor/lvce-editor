import * as Assert from '../Assert/Assert.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRemoteRequest = async (socket, request) => {
  Assert.object(socket)
  Assert.object(request)
  socket.on('error', HandleSocketError.handleSocketError)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, result)
}
