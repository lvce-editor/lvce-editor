import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.js'

export const unwrapJsonRpcResult = (responseMessage) => {
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  throw new Error('unexpected response message')
}
