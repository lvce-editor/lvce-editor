import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.js'

const handleMessageFromWindow = (event) => {
  const { data } = event
  Callback.resolve(data.id, data)
}

// @ts-ignore
window.addEventListener('message', handleMessageFromWindow)

export const create = async ({ type }) => {
  const { id, promise } = Callback.registerPromise()
  const message = {
    jsonrpc: JsonRpcVersion.Two,
    id,
    method: 'CreateMessagePort.createMessagePort',
    params: [type],
  }
  // @ts-ignore
  if (typeof window.myApi === 'undefined') {
    throw new Error('Electron api was requested but is not available')
  }
  // @ts-ignore
  window.myApi.ipcConnect(message)
  const responseMessage = await promise
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  console.log({ responseMessage })
  return responseMessage
}
