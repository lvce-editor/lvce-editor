import * as Assert from '../Assert/Assert.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'

export const handleRequest = async (socket, request) => {
  Assert.object(socket)
  Assert.object(request)
  const fileResponse = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, fileResponse)
}
