import * as Assert from '../Assert/Assert.ts'
import * as GetData from '../GetData/GetData.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

const getPort = async (ipcId) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  // TODO call sendMessagePortToElectron function
  await RendererProcess.invokeAndTransfer('IpcParent.create', [port1], {
    method: RendererProcessIpcParentType.Electron,
    port: port1,
    ipcId,
  })
  return port2
}

export const create = async (options) => {
  const type = options.type
  const name = options.name || 'electron ipc'
  const ipcId = options.ipcId
  Assert.string(type)
  Assert.string(name)
  const port = await getPort(ipcId)
  return port
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
      this.listener = listener
      const wrappedListener = (event) => {
        const data = GetData.getData(event)
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
    sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
  }
}
