import * as Assert from '../Assert/Assert.ts'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.ts'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.ts'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.ts'

export const handleRemoteRequest = async (socket: any, request: any): Promise<any> => {
  Assert.object(socket)
  Assert.object(request)
  socket.on('error', HandleSocketError.handleSocketError)
  const result = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, result)
}
