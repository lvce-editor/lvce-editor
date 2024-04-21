import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'

export const listen = () => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  globalThis.acceptPort(port2)
  return port1
}

export const wrap = (port) => {
  return {
    port,
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables)
    },
    get onmessage() {
      return this.port.onmessage
    },
    set onmessage(listener) {
      this.port.onmessage = listener
    },
  }
}
