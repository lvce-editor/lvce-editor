/* istanbul ignore file */

export const Methods = {
  MessagePort: 1,
  ModuleWorker: 2,
  ReferencePort: 3,
}

/**
 * @type {number}
 */
const METHOD_PREFERRED = Methods.ModuleWorker

const getModule = () => {
  switch (METHOD_PREFERRED) {
    case Methods.ModuleWorker:
      return import('./IpcParentWithModuleWorker.js')
    case Methods.MessagePort:
      return import('./IpcParentWithMessagePort.js')
    case Methods.ReferencePort:
      return import('./IpcParentWithReferencePort.js')
    default:
      throw new Error('unknown method')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule()
  // @ts-ignore
  return module.create(options)
}
