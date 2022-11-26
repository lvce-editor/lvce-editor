import * as Callback from '../Callback/Callback.js'

export const Version = '2.0'

export const ErrorMethodNotFound = -32601

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: '2.0',
    method,
    params,
  })
}

export const invoke = (ipc, method, ...params) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: '2.0',
      method,
      params,
      id: callbackId,
    })
  })
}
