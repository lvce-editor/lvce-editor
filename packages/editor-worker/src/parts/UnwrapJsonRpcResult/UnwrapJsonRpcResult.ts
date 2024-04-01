import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'
import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.ts'

export const unwrapJsonRpcResult = (responseMessage) => {
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  throw new JsonRpcError('unexpected response message')
}
