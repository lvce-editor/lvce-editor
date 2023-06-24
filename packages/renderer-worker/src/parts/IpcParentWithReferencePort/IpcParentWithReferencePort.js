export const create = async ({ url }) => {
  const referencePort = await new Promise((resolve) => {
    globalThis.acceptReferencePort = resolve
    import(url)
  })
  delete globalThis.acceptReferencePort
  return referencePort
}

const getMessage = (message) => {
  return message
}

export const wrap = (referencePort) => {
  return {
    referencePort,
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
        const message = getMessage(event)
        listener(message)
      }
      this.referencePort.onmessage = wrappedListener
    },
    send(message) {
      this.referencePort.postMessage(message)
    },
  }
}
