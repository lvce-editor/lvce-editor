export const listen = () => {
  const referencePort = {
    onmessage(message, transferables) {},
    postMessage() {},
  }
  // TODO get rid of extra data wrapper
  globalThis.acceptReferencePort(referencePort)
  return referencePort
}

export const wrap = (referencePort) => {
  return {
    referencePort,
    send(message) {
      this.referencePort.onmessage({ data: message })
    },
    sendAndTransfer({ data: message }, transferables) {
      this.referencePort.onmessage(message, transferables)
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
