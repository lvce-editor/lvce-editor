import * as Assert from '../Assert/Assert.ts'
import * as GetData from '../GetData/GetData.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const create = async ({ url }) => {
  Assert.string(url)
  const portPromise = new Promise((resolve) => {
    globalThis.acceptPort = resolve
  })
  await import(url)
  const port = await portPromise
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
  return {
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const message = GetData.getData(event)
        listener(message)
      }
      this.port.onmessage = wrappedListener
    },
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
  }
}
