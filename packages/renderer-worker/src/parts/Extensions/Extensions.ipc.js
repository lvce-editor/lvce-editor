import * as Extensions from './Extensions.js'

export const name = 'Extensions'

// prettier-ignore
export const Commands = {
  createViewInstance: Extensions.createViewInstance,
  dispatchViewEvent: Extensions.dispatchViewEvent,
  disposeViewInstance: Extensions.disposeViewInstance,
  installFromDisk: Extensions.installFromDisk,
  openCachedExtensionsFolder: Extensions.openCachedExtensionsFolder,
  openExtensionsFolder: Extensions.openExtensionsFolder,
  saveViewInstanceState: Extensions.saveViewInstanceState,
}
