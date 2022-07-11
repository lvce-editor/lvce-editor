import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'

export const name = 'webExtensionHost'

export const ipc = ExtensionHostIpc.Methods.WebWorker

export const canActivate = (extension) => {
  return typeof extension.browser === 'string'
}
