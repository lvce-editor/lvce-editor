export const wrap = (window) => {
  return {
    window,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const data = event.data
        if ('method' in data) {
          return
        }
        listener({ data, target: this })
      }
      this.window.onmessage = wrappedListener
    },
    send(message) {
      this.window.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.window.postMessage(message, '*', transfer)
    },
    dispose() {
      this.window.onmessage = null
      this.window = undefined
      this.listener = undefined
    },
  }
}
