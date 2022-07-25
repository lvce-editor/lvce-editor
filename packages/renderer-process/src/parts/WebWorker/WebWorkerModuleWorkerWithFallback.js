import * as WebWorkerWithModuleWorker from './WebWorkerWithModuleWorker.js'
import * as WebWorkerWithMessagePort from './WebWorkerWithMessagePort.js'

export const create = async (url) => {
  try {
    return await WebWorkerWithModuleWorker.create(url)
  } catch (error) {
    if (
      error &&
      [
        'SyntaxError: import declarations may only appear at top level of a module',
        'SyntaxError: export declarations may only appear at top level of a module',
      ].includes(error.message)
    ) {
      return WebWorkerWithMessagePort.create(url)
    }
      throw error

  }
}
