import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getModule = (method) => {
  switch (method) {
    case IpcParentType.ElectronMessagePort:
      return import('./IpcParentWithElectron.js')
    case IpcParentType.MessagePort:
      return import('./IpcParentWithMessagePort.js')
    case IpcParentType.ModuleWorker:
      return import('./IpcParentWithModuleWorker.js')
    case IpcParentType.ReferencePort:
      return import('./IpcParentWithReferencePort.js')
    case IpcParentType.WebSocket:
      return import('./IpcParentWithWebSocket.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule(method)
  return module.create(options)
}
