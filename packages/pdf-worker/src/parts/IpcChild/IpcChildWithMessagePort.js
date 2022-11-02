export const listen = () => {
  const messageChannel = new MessageChannel()
  const { port1, port2 } = messageChannel
  globalThis.acceptPort(port2)
  console.log('accept port')
  return {
    send(message) {
      port1.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      port1.postMessage(message, transferables)
    },
    get onmessage() {
      return port1.onmessage
    },
    set onmessage(listener) {
      port1.onmessage = listener
    },
  }
}
