import * as GetUtilityProcessPortData from '../GetUtilityProcessPortData/GetUtilityProcessPortData.js'
import { IpcError } from '../IpcError/IpcError.js'

export const listen = () => {
  // @ts-ignore
  const parentPort = process.parentPort
  if (!parentPort) {
    throw new IpcError('parent port must be defined')
  }
  parentPort.postMessage('ready')
  return parentPort
}

export const wrap = (parentPort) => {
  return {
    parentPort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = GetUtilityProcessPortData.getUtilityProcessPortData(event)
          console.log({ actualData })
          listener(actualData)
        }
        this.parentPort.on(event, wrappedListener)
      } else if (event === 'close') {
        this.parentPort.on('close', listener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    off(event, listener) {
      this.parentPort.off(event, listener)
    },
    send(message) {
      this.parentPort.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.parentPort.postMessage(message, transfer)
    },
    dispose() {
      this.parentPort.close()
    },
  }
}
