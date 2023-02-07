import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('../IpcParent/IpcParentWithWebSocket.js')
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParent/IpcParentWithElectronMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
