import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParentWithElectron/IpcParentWithElectron.js')
    case IpcParentType.MessagePort:
      return import('../IpcParentWithMessagePort/IpcParentWithMessagePort.js')
    case IpcParentType.ModuleWorker:
      return import('../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js')
    case IpcParentType.ReferencePort:
      return import('../IpcParentWithReferencePort/IpcParentWithReferencePort.js')
    case IpcParentType.WebSocket:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug:
      return import('../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js')
    case IpcParentType.Node:
      return import('../IpcParentWithNode/IpcParentWithNode.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
