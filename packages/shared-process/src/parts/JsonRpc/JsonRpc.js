import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
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
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

export const invokeAndTransfer = async (ipc, handle, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      method,
      params,
      id,
    },
    handle
  )
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}
