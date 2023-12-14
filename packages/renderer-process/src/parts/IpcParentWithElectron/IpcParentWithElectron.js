import * as Callback from '../Callback/Callback.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

const handleMessageFromWindow = (event) => {
  const { origin, data } = event
  if (origin !== location.origin) {
    return
  }
  if ('method' in data) {
    return
  }
  Callback.resolve(data.id, data)
}

// @ts-ignore
window.addEventListener('message', handleMessageFromWindow)

export const create = async ({ type, name, port }) => {
  const { message, promise } = JsonRpcRequest.create('CreateMessagePort.createMessagePort', [type, name])
  if (!IsElectron.isElectron()) {
    throw new Error('Electron api was requested but is not available')
  }
  window.postMessage(message, '*', [port])
  const responseMessage = await promise
  UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return undefined
}
