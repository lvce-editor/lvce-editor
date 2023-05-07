import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.js'
import * as IpcChildWithModuleWorker from '../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js'

export const listen = async () => {
  const parentIpcRaw = await IpcChildWithModuleWorker.listen()
  const parentIpc = IpcChildWithModuleWorker.wrap(parentIpcRaw)
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(parentIpc)
  console.log({ firstMessage })
  if (firstMessage.method !== 'initialize') {
    throw new Error('unexpected first message')
  }
  const type = firstMessage.params[0]
  if (type === 'message-port') {
    const port = firstMessage.params[1]
    return port
  }
  return globalThis
}

export const wrap = (port) => {
  return {
    port,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables)
    },
    get onmessage() {
      return this.wrappedListener
    },
    set onmessage(listener) {
      if (listener) {
        this.wrappedListener = (event) => {
          console.log({ event })
          listener(event.data)
        }
      } else {
        this.wrappedListener = undefined
      }
      this.port.onmessage = this.wrappedListener
    },
  }
}
