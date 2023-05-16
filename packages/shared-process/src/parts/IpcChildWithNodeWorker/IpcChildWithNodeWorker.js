import { parentPort } from 'node:worker_threads'

export const listen = async () => {
  if (!parentPort) {
    throw new Error('parentPort is required')
  }
  parentPort.postMessage('ready')
  return parentPort
}

const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [handle, ...message.params],
    }
  }
  return message
}

export const wrap = (parentPort) => {
  return {
    parentPort,
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
          listener(actualData)
        }
        this.parentPort.on(event, wrappedListener)
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
