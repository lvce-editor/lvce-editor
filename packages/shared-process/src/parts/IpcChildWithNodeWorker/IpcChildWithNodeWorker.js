import { parentPort } from 'node:worker_threads'

export const listen = async () => {
  console.log('listening')
  if (!parentPort) {
    throw new Error('parentPort is required')
  }
  return parentPort
}

export const signal = (parentPort) => {
  console.log('sending ready')
  parentPort.postMessage('ready')
}

const getActualData = (message) => {
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
