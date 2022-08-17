import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'

export const name = 'nodeExtensionHost'

export const ipc = ExtensionHostIpc.Methods.Electron

export const canActivate = (extension) => {
  return typeof extension.main === 'string'
}
