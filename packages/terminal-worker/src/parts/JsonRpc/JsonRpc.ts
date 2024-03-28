import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.ts'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.ts'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.ts'

export const send = (transport, method, ...params) => {
  const message = JsonRpcEvent.create(method, params)
  transport.send(message)
}

export const invoke = async (ipc, method, ...params) => {
  const { message, promise } = JsonRpcRequest.create(method, params)
  ipc.send(message)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

export const invokeAndTransfer = async (ipc, transfer, method, ...params) => {
  const { message, promise } = JsonRpcRequest.create(method, params)
  ipc.sendAndTransfer(message, transfer)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}
