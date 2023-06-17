import { parentPort } from 'node:worker_threads'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const listen = async () => {
  if (!parentPort) {
    throw new Error('parentPort is required')
  }
  parentPort.postMessage('ready')
  return parentPort
}

const getActualData = (message) => {
  return message
}

export const wrap = (parentPort) => {
  return {
    shouldLogError: !IsElectron.isElectron(),
    parentPort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
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
    dispose() {
      this.parentPort.close()
    },
  }
}
