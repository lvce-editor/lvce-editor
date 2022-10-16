const ElectronBrowserViewFunctions = require('./ElectronBrowserViewFunctions.js')

// prettier-ignore
exports.Commands = {
  'ElectronBrowserViewFunctions.backward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.backward),
  'ElectronBrowserViewFunctions.forward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.forward),
  'ElectronBrowserViewFunctions.openDevtools': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.openDevtools),
  'ElectronBrowserViewFunctions.reload': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.reload),
  'ElectronBrowserViewFunctions.resizeBrowserView': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.resizeBrowserView),
  'ElectronBrowserViewFunctions.setIframeSrc': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.setIframeSrc),
}
