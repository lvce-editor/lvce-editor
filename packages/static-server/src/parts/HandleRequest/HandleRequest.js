import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.js'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.js'
import * as HttpServerResponseStream from '../HttpServerResponseStream/HttpServerResponseStream.js'
import * as IsImmutable from '../IsImmutable/IsImmutable.js'

export const handleRequest = async (request, socket) => {
  socket.on('error', HandleSocketError.handleSocketError)
  const { absolutePath, status, headers } = await GetResponseInfo.getResponseInfo(request, IsImmutable.isImmutable)
  await HttpServerResponseStream.send(request, socket, status, headers, absolutePath)
}
