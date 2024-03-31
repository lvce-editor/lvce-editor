import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.ts'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.ts'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.ts'

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
