import { ServerResponse } from 'node:http'
import * as Assert from '../Assert/Assert.ts'
import * as SetHeaders from '../SetHeaders/SetHeaders.ts'

const handleResponseError = (error: any): any => {
  console.error(`[shared-process] Failed to send response ${error}`)
}

export const send = async (request: any, socket: any, result: any): Promise<any> => {
  Assert.object(request)
  Assert.object(socket)
  Assert.object(result)
  const response = new ServerResponse(request)
  response.assignSocket(socket)
  response.statusCode = result.init.status
  SetHeaders.setHeaders(response, {
    ...result.init.headers,
    Connection: 'close',
  })

  // TODO use promises if possible
  socket.on('error', handleResponseError)
  response.end(result.body)
}
