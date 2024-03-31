import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParentWithNode/IpcParentWithNode.js')
    case IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug:
      return import('../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
