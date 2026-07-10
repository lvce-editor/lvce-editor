import * as HandleRequest from '../HandleRequest/HandleRequest.ts'
import type { Socket } from 'node:net'
import type { Request } from '../Request/Request.ts'

interface ParentMessage {
  readonly params: readonly [Request]
}

export const handleMessageFromParent = async (message: ParentMessage, socket: Socket | undefined): Promise<void> => {
  if (!socket) {
    // socket got closed
    console.log('socket got closed')
    return
  }
  const request = message.params[0]
  await HandleRequest.handleRequest(request, socket)
}
