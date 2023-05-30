import { IpcError } from '../IpcError/IpcError.js'

export const listen = async () => {
  if (!process.send) {
    throw new IpcError('process ipc is not available')
  }
  process.send('ready')
  return process
}

export const wrap = (process) => {
  return {
    process,
    send(message) {
      this.process.send(message)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          this.process.on('message', listener)
          break
        default:
          throw new Error('unknown event listener type')
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
