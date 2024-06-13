import * as GetData from '../GetData/GetData.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as IpcParentWithElectron from '../IpcParentWithElectron/IpcParentWithElectron.ts'

export const create = async (options: any) => {
  switch (Platform.platform) {
    case PlatformType.Web:
    case PlatformType.Remote:
      const module = await import('../IpcParentWithWebSocket/IpcParentWithWebSocket.ts')
      const rawIpc = await module.create(options)
      if (options.raw) {
        return rawIpc
      }
      return {
        rawIpc,
        module,
      }
    case PlatformType.Electron:
      return IpcParentWithElectron.create(options)
    default:
      throw new Error('unsupported platform')
  }
}

export const wrap = (port: any) => {
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
      const wrappedListener = (event: any) => {
        const data = GetData.getData(event)
        // @ts-ignore
        listener(data)
      }
      this.port.onmessage = wrappedListener
    },
    send(message: any) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message: any, transfer: any) {
      this.port.postMessage(message, transfer)
    },
  }
}
