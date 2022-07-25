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

export const create = async (url, name) => {
  switch (METHOD_PREFERRED) {
    case Methods.ModuleWorker:
      return IpcParentWithModuleWorker.create(url)
    case Methods.MessagePort:
      return IpcParentWithMessagePort.create(url)
    case Methods.ReferencePort:
      return IpcParentWithReferencePort.create(url)
    default:
      throw new Error('unknown method')
  }
}
