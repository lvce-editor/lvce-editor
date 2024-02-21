import * as ElectronWebContentsViewFunctions from './ElectronWebContentsViewViewFunctions.js'

export const name = 'ElectronWebContentsViewFunctions'

export const Commands = {
  resizeBrowserView: ElectronWebContentsViewFunctions.resizeBrowserView,
  setIframeSrc: ElectronWebContentsViewFunctions.setIframeSrc,
  focus: ElectronWebContentsViewFunctions.focus,
  openDevtools: ElectronWebContentsViewFunctions.openDevtools,
  reload: ElectronWebContentsViewFunctions.reload,
  forward: ElectronWebContentsViewFunctions.forward,
  backward: ElectronWebContentsViewFunctions.backward,
  cancelNavigation: ElectronWebContentsViewFunctions.cancelNavigation,
  show: ElectronWebContentsViewFunctions.show,
  hide: ElectronWebContentsViewFunctions.hide,
  inspectElement: ElectronWebContentsViewFunctions.inspectElement,
  copyImageAt: ElectronWebContentsViewFunctions.copyImageAt,
  setFallthroughKeyBindings: ElectronWebContentsViewFunctions.setFallthroughKeyBindings,
  getStats: ElectronWebContentsViewFunctions.getStats,
}
