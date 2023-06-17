const UnwrapJsonRpcResult = require('../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js')
const JsonRpcEvent = require('../JsonRpcEvent/JsonRpcEvent.js')
const JsonRpcRequest = require('../JsonRpcRequest/JsonRpcRequest.js')

exports.send = (transport, method, ...params) => {
  const message = JsonRpcEvent.create(method, params)
  transport.send(message)
}

exports.invoke = async (ipc, method, ...params) => {
  const { message, promise } = JsonRpcRequest.create(method, params)
  ipc.send(message)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

exports.invokeAndTransfer = async (ipc, transfer, method, ...params) => {
  const { message, promise } = JsonRpcRequest.create(method, params)
  ipc.sendAndTransfer(message, transfer)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}
