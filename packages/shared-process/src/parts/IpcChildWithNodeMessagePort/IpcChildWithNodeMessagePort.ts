import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'

export const listen = ({ messagePort }: any): any => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return messagePort
}

const getActualData = (message: any): any => {
  return message
}

export const wrap = (messagePort: any): any => {
  return {
    messagePort,
    on(event: any, listener: any): any {
      if (event === 'message') {
        const wrappedListener = (event: any): any => {
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
    off(event: any, listener: any): any {
      this.messagePort.off(event, listener)
    },
    send(message: any): any {
      this.messagePort.postMessage(message)
    },
    dispose(): any {
      this.messagePort.close()
    },
    start(): any {
      this.messagePort.start()
    },
  }
}
