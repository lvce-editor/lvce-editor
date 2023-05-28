import * as Callback from '../Callback/Callback.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

const handleMessageFromWindow = (event) => {
  const { data } = event
  Callback.resolve(data.id, data)
}

// @ts-ignore
window.addEventListener('message', handleMessageFromWindow)

export const create = async ({ type }) => {
  console.log('request electron ipc')
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
  const port = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  if (!port) {
    throw new IpcError(`port must be defined`)
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}

const getActualData = (event) => {
  return event.data
}

export const wrap = (port) => {
  return {
    port,
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables)
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const data = getActualData(event)
        listener(data)
      }
      this.port.onmessage = wrappedListener
    },
    get onmessage() {
      return this.port.onmessage
    },
    dispose() {
      this.port.close()
    },
  }
}
