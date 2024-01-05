import * as GetUtilityProcessPortData from '../GetUtilityProcessPortData/GetUtilityProcessPortData.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.js'

export const listen = ({ messagePort }) => {
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain')
  }
  messagePort.postMessage('ready')
  return messagePort
}

export const wrap = (messagePort) => {
  return {
    messagePort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = GetUtilityProcessPortData.getUtilityProcessPortData(event)
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
