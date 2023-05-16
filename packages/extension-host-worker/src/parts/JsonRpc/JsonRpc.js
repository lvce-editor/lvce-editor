import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: params,
  })
}

export const invoke = async (ipc, method, ...params) => {
  Assert.object(ipc)
  Assert.string(method)
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
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
