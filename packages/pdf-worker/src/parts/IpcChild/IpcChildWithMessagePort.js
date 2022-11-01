export const listen = () => {
  const messageChannel = new MessageChannel()
  globalThis.acceptPort(messageChannel.port2)
  return {
    send(message) {
      messageChannel.port1.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      messageChannel.port1.postMessage(message, transferables)
    },
    get onmessage() {
      return messageChannel.port1.onmessage
    },
    set onmessage(listener) {
      messageChannel.port1.onmessage = listener
    },
  }
}
