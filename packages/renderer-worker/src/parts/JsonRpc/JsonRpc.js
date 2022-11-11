import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const send = (transport, method, ...parameters) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: parameters,
  })
}

export const invoke = (transport, method, ...parameters) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    transport.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params: parameters,
      id: callbackId,
    })
  })
}
