import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import * as IpcTrace from '../IpcTrace/IpcTrace.js'

/** @param {any} options */
export const create = async (options) => {
  const { url, name, port, id, traceId = '' } = options
  // TODO no need to create port if worker
  // has been prelaunched in renderer process
  const { port1, port2 } = GetPortTuple.getPortTuple(port)
  const workerPort = await IpcTrace.maybeCreateProxy({
    id,
    name,
    port: port2,
    traceId,
  })
  await RendererProcess.invokeAndTransfer('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    url,
    name,
    raw: true,
    port: workerPort,
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
