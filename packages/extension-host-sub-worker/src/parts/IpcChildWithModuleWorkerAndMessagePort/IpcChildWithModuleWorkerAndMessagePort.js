import * as GetData from '../GetData/GetData.js'
import * as IpcChildWithModuleWorker from '../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.js'

export const listen = async () => {
  const parentIpcRaw = await IpcChildWithModuleWorker.listen()
  const parentIpc = IpcChildWithModuleWorker.wrap(parentIpcRaw)
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(parentIpc)
  if (firstMessage.method !== 'initialize') {
    throw new IpcError('unexpected first message')
  }
  const type = firstMessage.params[0]
  if (type === 'message-port') {
    parentIpcRaw.postMessage({
      jsonrpc: '2.0',
      id: firstMessage.id,
      result: null,
    })
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
          const actualData = GetData.getData(event)
          listener(actualData)
        }
      } else {
        this.wrappedListener = undefined
      }
      this.port.onmessage = this.wrappedListener
    },
  }
}
