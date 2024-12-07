import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.js'
import * as HttpServerResponseStream from '../HttpServerResponseStream/HttpServerResponseStream.js'

export const handleRequest = async (request, socket) => {
  const { absolutePath, status, headers } = await GetResponseInfo.getResponseInfo(request)
  await HttpServerResponseStream.send(request, socket, status, headers, absolutePath)
}
