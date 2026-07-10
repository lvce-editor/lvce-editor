import * as GetResponseInfo from '../GetResponseInfo/GetResponseInfo.ts'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.ts'
import * as HttpServerResponseStream from '../HttpServerResponseStream/HttpServerResponseStream.ts'
import * as IsImmutable from '../IsImmutable/IsImmutable.ts'
import type { Socket } from 'node:net'
import type { Request } from '../Request/Request.ts'

// TODO this is deprecated
export const handleRequest = async (request: Request, socket: Socket): Promise<void> => {
  socket.on('error', HandleSocketError.handleSocketError)
  const { absolutePath, status, headers } = await GetResponseInfo.getResponseInfo({
    request,
    isImmutable: IsImmutable.isImmutable,
  })
  await HttpServerResponseStream.send(request, socket, status, headers, absolutePath)
}
