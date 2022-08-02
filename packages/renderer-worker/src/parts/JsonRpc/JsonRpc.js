import * as Callback from '../Callback/Callback.js'

const JSON_RPC_VERSION = '2.0'

export const send = (transport, method, ...parameters) => {
  transport.send({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params: parameters,
  })
}

export const invoke = (transport, method, ...parameters) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    transport.send({
      jsonrpc: JSON_RPC_VERSION,
      method,
      params: parameters,
      id: callbackId,
    })
  })
}
