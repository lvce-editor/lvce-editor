const ElectronBrowserViewFunctions = require('./ElectronBrowserViewFunctions.js')

exports.name = 'ElectronBrowserViewFunctions'

// prettier-ignore
exports.Commands = {
  backward: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.backward),
  cancelNavigation: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.cancelNavigation),
  copyImageAt: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.copyImageAt),
  focus: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.focus),
  forward: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.forward),
  getStats: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.getStats),
  hide: ElectronBrowserViewFunctions.hide,
  inspectElement: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.inspectElement),
  openDevtools: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.openDevtools),
  reload: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.reload),
  resizeBrowserView: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.resizeBrowserView),
  setFallthroughKeyBindings: ElectronBrowserViewFunctions.setFallThroughKeyBindings,
  setIframeSrc: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.setIframeSrc),
  show: ElectronBrowserViewFunctions.show,
}
