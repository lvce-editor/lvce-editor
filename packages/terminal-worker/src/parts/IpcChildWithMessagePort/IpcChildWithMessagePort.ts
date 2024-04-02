// @ts-nocheck

import * as GetData from '../GetData/GetData.ts'

export const listen = () => {
  const messageChannel = new MessageChannel()
  const { port1, port2 } = messageChannel
  globalThis.acceptPort(port2)
  return port1
}

export const wrap = (port) => {
  return {
    port,
    /**
     * @type {any}
     */
    listener: undefined,
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables)
    },
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const data = GetData.getData(event)
        listener({ data, target: this })
      }
      this.listener = listener
      this.port.onmessage = wrappedListener
    },
  }
}
