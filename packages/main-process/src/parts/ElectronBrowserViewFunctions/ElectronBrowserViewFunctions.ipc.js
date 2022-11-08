const ElectronBrowserViewFunctions = require('./ElectronBrowserViewFunctions.js')

// prettier-ignore
exports.Commands = {
  'ElectronBrowserViewFunctions.backward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.backward),
  'ElectronBrowserViewFunctions.copyImageAt': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.copyImageAt),
  'ElectronBrowserViewFunctions.focus': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.focus),
  'ElectronBrowserViewFunctions.forward': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.forward),
  'ElectronBrowserViewFunctions.hide': ElectronBrowserViewFunctions.hide,
  'ElectronBrowserViewFunctions.inspectElement': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.inspectElement),
  'ElectronBrowserViewFunctions.openDevtools': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.openDevtools),
  'ElectronBrowserViewFunctions.reload': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.reload),
  'ElectronBrowserViewFunctions.resizeBrowserView': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.resizeBrowserView),
  'ElectronBrowserViewFunctions.setIframeSrc': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.setIframeSrc),
  'ElectronBrowserViewFunctions.show': ElectronBrowserViewFunctions.show,
  'ElectronBrowserViewFunctions.copyImageAt': ElectronBrowserViewFunctions.wrapBrowserViewCommand(ElectronBrowserViewFunctions.copyImageAt),

}
