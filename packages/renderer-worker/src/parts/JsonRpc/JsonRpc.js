import * as Callback from '../Callback/Callback.js'

export const send = (transport, method, ...parameters) => {
  transport.send({
    jsonrpc: '2.0',
    method,
    params: parameters,
  })
}

export const invoke = (transport, method, ...parameters) => {
  return new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    transport.send({
      jsonrpc: '2.0',
      method,
      params: parameters,
      id: callbackId,
    })
  })
}
