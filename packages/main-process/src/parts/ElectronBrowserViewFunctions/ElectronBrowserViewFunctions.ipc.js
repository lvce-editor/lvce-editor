const ElectronBrowserViewFunctions = require('./ElectronBrowserViewFunctions.js')

exports.name = 'ElectronBrowserViewFunctions'

// prettier-ignore
exports.Commands = {
  backward: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.backward),
  copyImageAt: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.copyImageAt),
  focus: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.focus),
  forward: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.forward),
  hide: ElectronBrowserViewFunctions.hide,
  inspectElement: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.inspectElement),
  openDevtools: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.openDevtools),
  reload: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.reload),
  resizeBrowserView: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.resizeBrowserView),
  setIframeSrc: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.setIframeSrc),
  cancelNavigation: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.cancelNavigation),
  getStats: ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.getStats),
  show: ElectronBrowserViewFunctions.show,
  setFallthroughKeyBindings: ElectronBrowserViewFunctions.setFallThroughKeyBindings,
}
