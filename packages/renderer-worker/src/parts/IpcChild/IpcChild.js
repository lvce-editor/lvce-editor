export const Methods = {
  MessagePort: 1,
  ModuleWorker: 2,
  ReferencePort: 3,
}

const getModule = (method) => {
  switch (method) {
    case Methods.MessagePort:
      return import('./IpcChildWithMessagePort.js')
    case Methods.ModuleWorker:
      return import('./IpcChildWithModuleWorker.js')
    case Methods.ReferencePort:
      return import('./IpcChildWithReferencePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const listen = async ({ method }) => {
  const module = await getModule(method)
  return module.listen()
}
