import * as Assert from '../Assert/Assert.ts'
import * as GetTestRequestResponse from '../GetTestRequestResponse/GetTestRequestResponse.ts'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.ts'

export const handleRequestTest = async (socket, request, indexHtmlPath) => {
  Assert.object(socket)
  Assert.object(request)
  Assert.string(indexHtmlPath)
  const result = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)
  await HttpServerResponse.send(request, socket, result)
}
