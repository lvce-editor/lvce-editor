import * as IpcChildType from '../parts/IpcChildType/IpcChildType.js'

const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('./IpcChildWithMessagePort.js')
    case IpcChildType.ModuleWorker:
      return import('./IpcChildWithModuleWorker.js')
    case IpcChildType.ReferencePort:
      return import('./IpcChildWithReferencePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const listen = async ({ method }) => {
  const module = await getModule(method)
  return module.listen()
}
