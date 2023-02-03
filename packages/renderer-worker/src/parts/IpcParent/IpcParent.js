import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getModule = (method) => {
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
    default:
      throw new Error('unexpected ipc type')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule(method)
  // @ts-ignore
  const rawIpc = await module.create(options)
  const ipc = module.wrap(rawIpc)
  return ipc
}
