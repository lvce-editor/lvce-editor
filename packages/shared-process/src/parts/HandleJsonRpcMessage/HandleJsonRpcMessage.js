import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve, preparePrettyError, logError) => {
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, ipc, execute, preparePrettyError, logError)
      try {
        ipc.send(response)
      } catch (error) {
        const errorResponse = GetErrorResponse.getErrorResponse(message, error, ipc, preparePrettyError, logError)
        ipc.send(errorResponse)
      }
      return
    }
    resolve(message.id, message)
    return
  }
  if ('method' in message) {
    await GetResponse.getResponse(message, ipc, execute, preparePrettyError, logError)
    return
  }
  throw new JsonRpcError('unexpected message')
}
