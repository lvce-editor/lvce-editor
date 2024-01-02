import { IpcError } from '../IpcError/IpcError.js'
import * as GetData from '../GetData/GetData.js'

export const listen = async () => {
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new IpcError('module is not in web worker scope')
  }
  globalThis.postMessage('ready')
  return globalThis
}

export const wrap = (port) => {
  return {
    port,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables)
    },
    get onmessage() {
      return this.wrappedListener
    },
    set onmessage(listener) {
      if (listener) {
        this.wrappedListener = (event) => {
          const actualData = GetData.getData(event)
          listener(actualData)
        }
      } else {
        this.wrappedListener = undefined
      }
      this.port.onmessage = this.wrappedListener
    },
  }
}
