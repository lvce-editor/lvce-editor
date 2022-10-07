/* istanbul ignore file */

export const Methods = {
  MessagePort: 1,
  ModuleWorker: 2,
  ReferencePort: 3,
  ModuleWorkerWithChromeDevtoolsBugWorkaround: 4,
}

const getModule = (method) => {
  switch (method) {
    case Methods.ModuleWorker:
      return import('./IpcParentWithModuleWorker.js')
    case Methods.MessagePort:
      return import('./IpcParentWithMessagePort.js')
    case Methods.ReferencePort:
      return import('./IpcParentWithReferencePort.js')
    case Methods.ModuleWorkerWithChromeDevtoolsBugWorkaround:
      return import('./IpcParentModuleWorkerWithChromeDevtoolsBugWorkaround.js')
    default:
      throw new Error('unknown method')
  }
}

export const create = async ({ method, ...options }) => {
  console.log('create,', {
    method,
    options,
  })
  const module = await getModule(method)
  // @ts-ignore
  return module.create(options)
}
