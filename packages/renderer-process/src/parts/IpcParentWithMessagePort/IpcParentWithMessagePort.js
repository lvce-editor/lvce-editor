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
