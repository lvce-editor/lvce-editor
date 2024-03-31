import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.ts')
    case IpcParentType.ElectronMessagePort:
      return import('../IpcParentWithNode/IpcParentWithNode.ts')
    case IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug:
      return import('../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
