import * as Assert from '../Assert/Assert.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const create = async ({ url }) => {
  Assert.string(url)
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  if (!port) {
    throw new IpcError('port must be defined')
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}

export const wrap = (port) => {
  let handleMessage
  return {
    get onmessage() {
      return port.onmessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            listener(message)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
    send(message) {
      port.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      port.postMessage(message, transfer)
    },
  }
}
