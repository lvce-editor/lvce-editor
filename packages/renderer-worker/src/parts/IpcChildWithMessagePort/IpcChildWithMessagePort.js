export const listen = () => {
  const messageChannel = new MessageChannel()
  const { port1, port2 } = messageChannel
  globalThis.acceptPort(port2)
  return port1
}

const getMessage = (event) => {
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
    get onmessage() {
      return this.port.onmessage
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const message = getMessage(event)
        listener(message)
      }
      this.port.onmessage = wrappedListener
    },
  }
}
