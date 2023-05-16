import { IpcError } from '../IpcError/IpcError.js'
import * as IsElectronMessagePort from '../IsElectronMessagePort/IsElectronMessagePort.js'

export const listen = ({ messagePort }) => {
  if (!IsElectronMessagePort.isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain')
  }
  return messagePort
}

const getActualData = (event) => {
  return event.data
}

export const wrap = (messagePort) => {
  return {
    messagePort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
          listener(actualData)
        }
        this.messagePort.on(event, wrappedListener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    off(event, listener) {
      this.messagePort.off(event, listener)
    },
    send(message) {
      this.messagePort.postMessage(message)
    },
    dispose() {
      this.messagePort.close()
    },
  }
}
