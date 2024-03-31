import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

export const send = (transport, method, ...params) => {
  const message = JsonRpcEvent.create(method, params)
  transport.send(message)
}

export const invoke = async (ipc, method, ...params) => {
  Assert.object(ipc)
  Assert.string(method)
  const { message, promise } = JsonRpcRequest.create(method, params)
  ipc.send(message)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

export const handleMessage = (message) => {
  if ('id' in message) {
    if ('method' in message) {
      throw new Error('not implemented')
    }
    Callback.resolve(message.id, message)
  }
}
