export const listen = () => {
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new Error('module is not in web worker scope')
  }
  return globalThis
}

export const signal = (global) => {
  global.postMessage('ready')
}

const getMessage = (event) => {
  return event.data
}

export const wrap = (global) => {
  return {
    global,
    /**
     * @type {any}
     */
    listener: undefined,
    send(message) {
      this.global.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.global.postMessage(message, transferables)
    },
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const message = getMessage(event)
        listener(message)
      }
      this.listener = listener
      this.global.onmessage = wrappedListener
    },
  }
}
