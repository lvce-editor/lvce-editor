import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const listen = ({ messagePort }) => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return messagePort
}

const getActualData = (message) => {
  return message
}

export const wrap = (messagePort) => {
  return {
    messagePort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
          const syntheticEvent = {
            data: actualData,
            target: this,
          }
          listener(syntheticEvent)
        }
        this.messagePort.on(event, wrappedListener)
      } else if (event === 'close') {
        this.messagePort.on('close', listener)
      } else {
        throw new Error(`unsupported event type ${event}`)
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
    start() {
      this.messagePort.start()
    },
  }
}
