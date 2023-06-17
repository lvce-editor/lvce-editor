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

const getActualData = (event) => {
  const { data, ports } = event
  if (ports.length === 0) {
    return data
  }
  return {
    ...data,
    params: [...data.params, ...ports],
  }
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
