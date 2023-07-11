import { IpcError } from '../IpcError/IpcError.js'

export const listen = async () => {
  if (!process.send) {
    throw new IpcError('process ipc is not available')
  }
  process.send('ready')
  return process
}

const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [...message.params, handle],
    }
  }
  return message
}

export const wrap = (process) => {
  return {
    process,
    send(message) {
      this.process.send(message)
    },
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (message, handle) => {
          const actualData = getActualData(message, handle)
          listener(actualData)
        }
        this.process.on(event, wrappedListener)
      }
    },
    off(event, listener) {
      switch (event) {
        case 'message':
          this.process.off('message', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
