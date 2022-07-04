import * as WebWorkerWithMessagePort from './WebWorkerWithMessagePort.js'
import * as WebWorkerWithModuleWorker from './WebWorkerWithModuleWorker.js'
import * as WebWorkerWithReferencePort from './WebWorkerWithReferencePort.js'

/* istanbul ignore file */
const METHOD_MESSAGE_PORT = 1
const METHOD_MODULE_WORKER = 2
const METHOD_REFERENCE_PORT = 3

/**
 * @type {number}
 */
const METHOD_PREFERRED = METHOD_MESSAGE_PORT

export const create = async (url) => {
  switch (METHOD_PREFERRED) {
    case METHOD_MODULE_WORKER:
      return WebWorkerWithModuleWorker.create(url)
    case METHOD_MESSAGE_PORT:
      return WebWorkerWithMessagePort.create(url)
    case METHOD_REFERENCE_PORT:
      return WebWorkerWithReferencePort.create(url)
    default:
      throw new Error('unknown method')
  }
}
