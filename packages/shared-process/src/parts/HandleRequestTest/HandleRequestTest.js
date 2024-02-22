import * as Assert from '../Assert/Assert.js'
import * as GetTestRequestResponse from '../GetTestRequestResponse/GetTestRequestResponse.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRequestTest = async (request, socket, indexHtmlPath) => {
  Assert.object(request)
  Assert.object(socket)
  Assert.string(indexHtmlPath)
  const result = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)
  HttpServerResponse.send(request, socket, result)
}
