import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.js'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: params,
  })
}

export const invoke = async (ipc, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
  const responseMessage = await promise
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }

  throw new Error('unexpected response message')
}
