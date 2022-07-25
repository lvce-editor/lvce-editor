export const Methods = {
  Electron: 1,
  MessagePort: 2,
  ModuleWorker: 3,
  ReferencePort: 4,
  WebSocket: 5,
}

const getModule = (method) => {
  switch (method) {
    case Methods.Electron:
      return import('./IpcParentWithElectron.js')
    case Methods.MessagePort:
      return import('./IpcParentWithMessagePort.js')
    case Methods.ModuleWorker:
      return import('./IpcParentWithModuleWorker.js')
    case Methods.ReferencePort:
      return import('./IpcParentWithReferencePort.js')
    case Methods.WebSocket:
      return import('./IpcParentWithWebSocket.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule(method)
  return module.create(options)
}
