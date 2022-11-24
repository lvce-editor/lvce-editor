import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getModule = (method) => {
  switch (method) {
    case IpcParentType.ModuleWorker:
      return import('./IpcParentWithModuleWorker.js')
    case IpcParentType.MessagePort:
      return import('./IpcParentWithMessagePort.js')
    case IpcParentType.ReferencePort:
      return import('./IpcParentWithReferencePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule(method)
  // @ts-ignore
  return module.create(options)
}
