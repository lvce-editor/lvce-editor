import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

export const create = async ({ url, name }) => {
  const { port1, port2 } = new MessageChannel()
  await RendererProcess.invokeAndTransfer('IpcParent.create', [port1], {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    url,
    name,
    raw: true,
    port: port1,
  })
  return port2
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
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        // TODO why are some events not instance of message event?
        if (event instanceof MessageEvent) {
          const message = event.data
          listener(message, fakeEvent)
        } else {
          listener(event)
        }
      }
      this.port.onmessage = wrappedListener
    },
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
  }
}
