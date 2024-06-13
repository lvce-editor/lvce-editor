export const listen = () => {
  const referencePort = {
    onmessage(message: any, transferables: any) {},
    postMessage() {},
  }
  // TODO get rid of extra data wrapper
  // @ts-ignore
  globalThis.acceptReferencePort(referencePort)
  return referencePort
}

export const wrap = (referencePort: any) => {
  return {
    referencePort,
    send(message: any) {
      this.referencePort.onmessage({ data: message })
    },
    sendAndTransfer({ data: message }: any, transferables: any) {
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
