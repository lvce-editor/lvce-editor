import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

export const create = async ({ url, name }) => {
  const port = await RendererProcess.invoke('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    url,
    name,
    raw: true,
  })
  if (!port) {
    throw new IpcError('port must be defined')
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}

export const wrap = (port) => {
  const fakeEvent = {
    target: {
      send(message, transfer) {
        port.postMessage(message, transfer)
      },
      postMessage(message, transfer) {
        port.postMessage(message, transfer)
      },
    },
  }
  return {
    port,
    /**
     * @type {any}
     */
    handleMessage: undefined,
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        this.handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            listener(message, fakeEvent)
          } else {
            listener(event)
          }
        }
      } else {
        this.handleMessage = null
      }
      this.port.onmessage = this.handleMessage
    },
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
  }
}
