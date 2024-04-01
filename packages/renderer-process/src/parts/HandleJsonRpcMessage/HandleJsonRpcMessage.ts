import * as GetResponse from '../GetResponse/GetResponse.ts'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  // TODO adjust ipc implementation so that message is always a message
  if (message && message.message) {
    message = message.message
  }
  if (message && message.data) {
    message = message.data
  }
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      ipc.send(response)
      return
    }
    resolve(message.id, message)
    return
  }
  throw new JsonRpcError('unexpected message from renderer worker')
}
