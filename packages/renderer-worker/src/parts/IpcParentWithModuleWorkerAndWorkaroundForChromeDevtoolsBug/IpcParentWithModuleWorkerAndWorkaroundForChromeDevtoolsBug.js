import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'

export const create = async ({ url, name, port, id }) => {
  // TODO no need to create port if worker
  // has been prelaunched in renderer process
  const { port1, port2 } = GetPortTuple.getPortTuple(port)
  await RendererProcess.invokeAndTransfer('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    url,
    name,
    raw: true,
    port: port2,
    id,
  })
  return port1
}

// TODO why are some events not instance of message event?

const getData = (event) => {
  if (event instanceof MessageEvent) {
    return event.data
  }
  return event
}

export const wrap = (port) => {
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
        const data = getData(event)
        const syntheticEvent = {
          data,
          target: this,
        }
        listener(syntheticEvent)
      }
      this.port.onmessage = wrappedListener
    },
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message) {
      const transfer = GetTransferrables.getTransferrables(message)
      this.port.postMessage(message, transfer)
    },
    dispose() {
      this.port.postMessage({
        jsonrpc: '2.0',
        method: 'Exit.exit',
        params: [],
      })
      this.port.close()
    },
  }
}
