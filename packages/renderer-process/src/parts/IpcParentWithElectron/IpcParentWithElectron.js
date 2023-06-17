import * as Callback from '../Callback/Callback.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

const handleMessageFromWindow = (event) => {
  const { data } = event
  Callback.resolve(data.id, data)
}

// @ts-ignore
window.addEventListener('message', handleMessageFromWindow)

export const create = async ({ type, name }) => {
  const { message, promise } = JsonRpcRequest.create('CreateMessagePort.createMessagePort', [type, name])
  // @ts-ignore
  if (typeof window.myApi === 'undefined') {
    throw new Error('Electron api was requested but is not available')
  }
  // @ts-ignore
  window.myApi.ipcConnect(message)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}
