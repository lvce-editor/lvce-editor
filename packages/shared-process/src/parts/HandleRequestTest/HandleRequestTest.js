import * as Assert from '../Assert/Assert.js'
import * as GetTestRequestResponse from '../GetTestRequestResponse/GetTestRequestResponse.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRequestTest = async (request, socket) => {
  Assert.object(request)
  Assert.object(socket)
  const result = await GetTestRequestResponse.getTestRequestResponse(request)
  console.log({ result })
  HttpServerResponse.send(request, socket, result)
}
