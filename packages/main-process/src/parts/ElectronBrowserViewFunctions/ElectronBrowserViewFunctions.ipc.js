const ElectronBrowserViewFunctions = require('./ElectronBrowserViewFunctions.js')

// prettier-ignore
exports.Commands = {
  'ElectronBrowserViewFunctions.openDevtools': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.openDevtools),
  'ElectronBrowserViewFunctions.resizeBrowserView': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.resizeBrowserView),
  'ElectronBrowserViewFunctions.setIframeSrc': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.setIframeSrc),
  'ElectronBrowserViewFunctions.forward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.forward),
  'ElectronBrowserViewFunctions.reload': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.reload),
  'ElectronBrowserViewFunctions.backward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.backward),
}
