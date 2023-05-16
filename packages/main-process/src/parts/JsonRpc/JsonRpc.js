const Callback = require('../Callback/Callback.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

exports.send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}

exports.invoke = (ipc, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
  return promise
}

exports.invokeAndTransfer = (ipc, transfer, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      method,
      params,
      id,
    },
    transfer
  )
  return promise
}
