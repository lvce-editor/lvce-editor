// @ts-nocheck
import * as GetData from '../GetData/GetData.ts'

export const listen = () => {
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new TypeError('module is not in web worker scope')
  }
  globalThis.postMessage('ready')
  return globalThis
}

export const signal = (global) => {
  global.postMessage('ready')
}

export const wrap = (global) => {
  return {
    global,
    /**
     * @type {any}
     */
    listener: undefined,
    send(message) {
      this.global.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.global.postMessage(message, transferables)
    },
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const message = GetData.getData(event)
        listener(message)
      }
      this.listener = listener
      this.global.onmessage = wrappedListener
    },
  }
}
