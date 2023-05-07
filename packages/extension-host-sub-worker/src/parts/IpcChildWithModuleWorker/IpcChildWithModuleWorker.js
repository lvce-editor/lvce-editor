export const listen = () => {
  // @ts-ignore
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
    on(event, listener) {
      this.global.addEventListener(event, listener)
    },
    off(event, listener) {
      this.global.removeEventListener(event, listener)
    },
  }
}
