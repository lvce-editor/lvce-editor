export const listen = () => {
  const referencePort = {
    onmessage(message, transferables) {},
    postMessage() {},
  }
  // TODO get rid of extra data wrapper
  globalThis.acceptReferencePort(referencePort)
  return {
    send(message) {
      referencePort.onmessage({ data: message })
    },
    sendAndTransfer({ data: message }, transferables) {
      referencePort.onmessage(message, transferables)
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
