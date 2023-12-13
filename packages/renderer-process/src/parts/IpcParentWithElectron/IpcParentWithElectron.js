import * as Callback from '../Callback/Callback.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

const handleMessageFromWindow = (event) => {
  console.log({ event })
  if (event.origin !== location.origin) {
    return
  }
  if (event.ports.length) {
    return
  }
  const { data } = event
  Callback.resolve(data.id, data)
}

// @ts-ignore

export const create = async ({ type, name }) => {
  const { message, promise } = JsonRpcRequest.create('CreateMessagePort.createMessagePort', [type, name])
  // @ts-ignore
  // if (typeof window.myApi === 'undefined') {
  //   throw new Error('Electron api was requested but is not available')
  // }

  const { port1 } = new MessageChannel()
  // message.params.push(port1)
  window.postMessage(message, location.origin, [port1])
  window.addEventListener('message', handleMessageFromWindow, {})

  // @ts-ignore
  // window.myApi.ipcConnect(message)
  const responseMessage = await promise
  console.log({ responseMessage })
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  console.log({ result })
  return result
}
