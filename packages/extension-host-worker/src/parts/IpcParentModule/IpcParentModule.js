import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.js')
    case IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug:
      return import('../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
