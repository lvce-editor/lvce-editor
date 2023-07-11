export const listen = () => {
  const referencePort = {
    onmessage(message, transferables) {},
    postMessage() {},
  }
  // TODO get rid of extra data wrapper
  globalThis.acceptReferencePort(referencePort)
  return referencePort
}

export const wrap = (port) => {
  return {
    port,
    send(message) {
      this.port.onmessage({ data: message })
    },
    sendAndTransfer({ data: message }, transferables) {
      this.port.onmessage(message, transferables)
    },
    get onmessage() {
      // TODO
      return null
    },
    set onmessage(listener) {
      // TODO
    },
  }
}
