export const listen = () => {
  const postMessageFn = globalThis.postMessage
  postMessageFn('ready')
  return {
    send(message) {
      postMessageFn(message)
    },
    sendAndTransfer(message, transferables) {
      postMessageFn(message, transferables)
    },
    get onmessage() {
      return onmessage
    },
    set onmessage(listener) {
      onmessage = listener
    },
  }
}
