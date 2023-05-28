import * as GetResponse from '../GetResponse/GetResponse.js'
import * as HasTransferableResult from '../HasTransferableResult/HasTransferableResult.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  if (message && message.message) {
    message = message.message
  }
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      if (HasTransferableResult.hasTransferrableResult(message.method) && 'result' in response) {
        ipc.sendAndTransfer(response, [response.result])
      } else {
        ipc.send(response)
      }
      return
    }
    resolve(message.id, message)
    return
  }
  throw new JsonRpcError('unexpected message from renderer worker')
}
