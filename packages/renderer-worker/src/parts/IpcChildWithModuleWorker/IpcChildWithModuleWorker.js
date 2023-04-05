export const listen = () => {
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new Error('module is not in web worker scope')
  }
  globalThis.postMessage('ready')
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
