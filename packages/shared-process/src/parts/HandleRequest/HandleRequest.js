import * as Assert from '../Assert/Assert.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'

export const handleRequest = async (socket, request, indexHtmlPath) => {
  Assert.object(socket)
  Assert.object(request)
  Assert.string(indexHtmlPath)
  const fileResponse = await GetElectronFileResponse.getElectronFileResponse(request.url, request)
  HttpServerResponse.send(request, socket, fileResponse)
}
