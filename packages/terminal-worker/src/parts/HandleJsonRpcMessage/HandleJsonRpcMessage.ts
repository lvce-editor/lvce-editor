import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'

export const handleJsonRpcMessage = async (event, execute, resolve) => {
  const { target, data } = event
  if ('id' in data) {
    if ('method' in data) {
      const response = await GetResponse.getResponse(data, execute)
      try {
        target.send(response)
      } catch (error) {
        await ErrorHandling.logError(error)
        const errorResponse = GetErrorResponse.getErrorResponse(data, error)
        target.send(errorResponse)
      }
      return
    }
    resolve(data.id, data)
    return
  }
  if ('method' in data) {
    await GetResponse.getResponse(data, execute)
    return
  }
  throw new JsonRpcError('unexpected message')
}
