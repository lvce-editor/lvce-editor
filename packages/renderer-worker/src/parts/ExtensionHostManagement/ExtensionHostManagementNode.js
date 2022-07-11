import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'

export const name = 'nodeExtensionHost'

export const ipc = ExtensionHostIpc.Methods.SharedProcess

export const canActivate = (extension) => {
  return typeof extension.main === 'string'
}
