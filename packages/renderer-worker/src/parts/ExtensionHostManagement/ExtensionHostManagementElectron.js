import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const name = 'nodeExtensionHost'

export const ipc = IpcParentType.ElectronMessagePort

export const canActivate = (extension) => {
  return typeof extension.main === 'string'
}
