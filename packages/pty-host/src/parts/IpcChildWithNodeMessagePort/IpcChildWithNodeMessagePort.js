import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const listen = async ({ messagePort }) => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError(`port must be of type MessagePort`)
  }
  return messagePort
}

export const wrap = (port) => {
  return {
    port,
    on(event, listener) {
      this.port.on(event, listener)
    },
    off(event, listener) {
      this.port.off(event, listener)
    },
    send(message) {
      this.port.postMessage(message)
    },
    dispose() {
      this.port.close()
    },
  }
}
