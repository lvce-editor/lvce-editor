import * as Assert from '../Assert/Assert.js'
import * as HttpServerResponse from '../HttpServerResponse/HttpServerResponse.js'

export const handleRequest = async (socket, request, indexHtmlPath) => {
  Assert.object(socket)
  Assert.object(request)
  Assert.string(indexHtmlPath)
  HttpServerResponse.send(request, socket, {
    body: 'okay',
    init: {
      status: 200,
      headers: {},
    },
  })
}
