export const listen = () => {
  postMessage('ready')
  return {
    send(message) {
      postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      postMessage(message, transferables)
    },
    get onmessage() {
      return onmessage
    },
    set onmessage(listener) {
      onmessage = listener
    },
  }
}
