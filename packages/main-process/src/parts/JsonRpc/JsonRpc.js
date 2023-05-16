const Callback = require('../Callback/Callback.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')
const UnwrapJsonRpcResult = require('../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js')

exports.send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}

exports.invoke = async (ipc, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapResult(responseMessage)
  return result
}

exports.invokeAndTransfer = async (ipc, transfer, method, ...params) => {
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
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapResult(responseMessage)
  return result
}
