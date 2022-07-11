import * as ExtensionHostIpcWithSharedProcess from './ExtensionHostIpcWithSharedProcess.js'
import * as ExtensionHostIpcWithWebWorker from './ExtensionHostIpcWithWebWorker.js'

export const Methods = {
  SharedProcess: 1,
  WebWorker: 2,
}

export const listen = (method) => {
  switch (method) {
    case Methods.SharedProcess:
      return ExtensionHostIpcWithSharedProcess.listen()
    case Methods.WebWorker:
      return ExtensionHostIpcWithWebWorker.listen()
    default:
      throw new Error(`unexpected extension host type: ${method}`)
  }
}
