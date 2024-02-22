import * as Assert from '../Assert/Assert.js'
import * as GetTestRequestResponse from '../GetTestRequestResponse/GetTestRequestResponse.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRequestTest = async (request, indexHtmlPath, socket) => {
  Assert.object(request)
  Assert.string(indexHtmlPath)
  Assert.object(socket)
  const result = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)
  HttpServerResponse.send(request, socket, result)
}
