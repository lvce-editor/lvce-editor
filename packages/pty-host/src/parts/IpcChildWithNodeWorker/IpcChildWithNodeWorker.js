import { parentPort } from 'node:worker_threads'
import { IpcError } from '../IpcError/IpcError.js'

export const listen = async () => {
  if (!parentPort) {
    throw new IpcError('parentPort is required')
  }
  parentPort.postMessage('ready')
  return parentPort
}

export const wrap = (parentPort) => {
  return {
    parentPort,
    on(event, listener) {
      this.parentPort.on(event, listener)
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
