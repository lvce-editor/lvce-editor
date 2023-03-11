import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
