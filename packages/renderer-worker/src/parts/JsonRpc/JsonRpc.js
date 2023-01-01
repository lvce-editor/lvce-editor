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
  const responseMessage = await new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params,
      id: callbackId,
    })
  })
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }

  throw new Error('unexpected response message')
}
