// TODO lazyload these files
import * as IpcParentWithMessagePort from './IpcParentWithMessagePort.js'
import * as IpcParentWithModuleWorker from './IpcParentWithModuleWorker.js'
import * as IpcParentWithReferencePort from './IpcParentWithReferencePort.js'

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

export const create = async ({ method, ...options }) => {
  switch (METHOD_PREFERRED) {
    case Methods.ModuleWorker:
      return IpcParentWithModuleWorker.create(options)
    case Methods.MessagePort:
      return IpcParentWithMessagePort.create(options)
    case Methods.ReferencePort:
      return IpcParentWithReferencePort.create(options)
    default:
      throw new Error('unknown method')
  }
}
