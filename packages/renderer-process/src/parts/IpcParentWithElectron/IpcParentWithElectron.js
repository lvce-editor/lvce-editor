import * as Callback from '../Callback/Callback.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

const handleMessageFromWindow = (event) => {
  if (event.origin !== location.origin) {
    return
  }
  const { data } = event
  Callback.resolve(data.id, data)
}

// @ts-ignore
window.addEventListener('message', handleMessageFromWindow)

export const create = async ({ type, name }) => {
  const { port1, port2 } = new MessageChannel()
  const { message, promise } = JsonRpcRequest.create('CreateMessagePort.createMessagePort', [type, name])
  // @ts-ignore
  if (typeof window.myApi === 'undefined') {
    throw new Error('Electron api was requested but is not available')
  }
  // @ts-ignore
  window.myApi.ipcConnect(message, [port2])
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}
