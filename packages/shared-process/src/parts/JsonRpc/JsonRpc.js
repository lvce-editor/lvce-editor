import * as Callback from '../Callback/Callback.js'

const JSON_RPC_VERSION = '2.0'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
  })
}

export const invoke = (ipc, method, ...params) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: JSON_RPC_VERSION,
      method,
      params,
      id: callbackId,
    })
  })
}
