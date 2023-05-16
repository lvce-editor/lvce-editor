import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}

export const invoke = (ipc, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
  return promise
}

export const invokeAndTransfer = (ipc, handle, method, ...params) => {
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
  return promise
}
