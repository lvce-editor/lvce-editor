import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const name = 'webExtensionHost'

export const ipc = IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug

export const canActivate = (extension) => {
  return typeof extension.browser === 'string'
}
