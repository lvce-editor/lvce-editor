import * as ElectronBrowserViewFunctions from './ElectronBrowserViewFunctions.js'

export const name = 'ElectronBrowserViewFunctions'

export const Commands = {
  resizeBrowserView: ElectronBrowserViewFunctions.resizeBrowserView,
  setIframeSrc: ElectronBrowserViewFunctions.setIframeSrc,
  focus: ElectronBrowserViewFunctions.focus,
  openDevtools: ElectronBrowserViewFunctions.openDevtools,
  reload: ElectronBrowserViewFunctions.reload,
  forward: ElectronBrowserViewFunctions.forward,
  backward: ElectronBrowserViewFunctions.backward,
  cancelNavigation: ElectronBrowserViewFunctions.cancelNavigation,
  show: ElectronBrowserViewFunctions.show,
  hide: ElectronBrowserViewFunctions.hide,
  inspectElement: ElectronBrowserViewFunctions.inspectElement,
  copyImageAt: ElectronBrowserViewFunctions.copyImageAt,
  setFallthroughKeyBindings: ElectronBrowserViewFunctions.setFallthroughKeyBindings,
  getStats: ElectronBrowserViewFunctions.getStats,
}
