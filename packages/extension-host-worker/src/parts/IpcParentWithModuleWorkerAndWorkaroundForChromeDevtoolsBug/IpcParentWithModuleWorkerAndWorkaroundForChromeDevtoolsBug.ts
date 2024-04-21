import * as Assert from '../Assert/Assert.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const create = async ({ url, name }) => {
  Assert.string(url)
  Assert.string(name)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Rpc.invokeAndTransfer([port1], 'IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
    raw: true,
    noReturn: true,
    port: port1,
  })
  return port2
}

export const wrap = (port) => {
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
        // @ts-ignore
        this.handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            // @ts-ignore
            listener(message, event)
          } else {
            // @ts-ignore

            listener(event)
          }
        }
      } else {
        // @ts-ignore
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
