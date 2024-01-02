import * as GetData from '../GetData/GetData.js'

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
        const message = GetData.getData(event)
        listener(message)
      }
      this.listener = listener
      this.port.onmessage = wrappedListener
    },
  }
}
