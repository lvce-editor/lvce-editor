import * as GetData from '../GetData/GetData.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.js'

export const create = async (options) => {
  switch (Platform.platform) {
    case PlatformType.Web:
    case PlatformType.Remote:
      const module = await import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
      const rawIpc = await module.create(options)
      if (options.raw) {
        return rawIpc
      }
      return {
        rawIpc,
        module,
      }
    case PlatformType.Electron:
      const { port1, port2 } = new MessageChannel()
      await SendMessagePortToElectron.sendMessagePortToElectron(port2)
      return port1
    default:
      throw new Error('unsupported platform')
  }
}

export const wrap = (port) => {
  if (!(port instanceof MessagePort)) {
    return port.module.wrap(port.rawIpc)
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
      this.listener = listener
      const wrappedListener = (event) => {
        const data = GetData.getData(event)
        listener(data)
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
