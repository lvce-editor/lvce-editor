export const listen = () => {
  const postMessageFn = globalThis.postMessage
  postMessageFn('ready')
  return globalThis
}

export const wrap = (global) => {
  return {
    global,
    send(message) {
      this.global.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.global.postMessage(message, transferables)
    },
    get onmessage() {
      return this.global.onmessage
    },
    set onmessage(listener) {
      this.global.onmessage = listener
    },
  }
}
