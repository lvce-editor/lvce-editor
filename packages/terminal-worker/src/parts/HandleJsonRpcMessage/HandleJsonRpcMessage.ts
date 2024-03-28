import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      try {
        ipc.send(response)
      } catch (error) {
        await ErrorHandling.logError(error)
        const errorResponse = GetErrorResponse.getErrorResponse(message, error)
        ipc.send(errorResponse)
      }
      return
    }
    resolve(message.id, message)
    return
  }
  throw new JsonRpcError('unexpected message')
}
