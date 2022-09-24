const ElectronWindow = require('./ElectronWindow.js')

// prettier-ignore
exports.Commands = {
  'ElectronWindow.close': ElectronWindow.wrapWindowCommand(ElectronWindow.close),
  'ElectronWindow.maximize': ElectronWindow.wrapWindowCommand(ElectronWindow.maximize),
  'ElectronWindow.minimize': ElectronWindow.wrapWindowCommand(ElectronWindow.minimize),
  'ElectronWindow.reload': ElectronWindow.wrapWindowCommand(ElectronWindow.reload),
  'ElectronWindow.toggleDevtools': ElectronWindow.wrapWindowCommand(ElectronWindow.toggleDevtools),
  'ElectronWindow.unmaximize': ElectronWindow.wrapWindowCommand(ElectronWindow.unmaximize),
  'ElectronWindow.zoomIn': ElectronWindow.wrapWindowCommand(ElectronWindow.zoomIn),
  'ElectronWindow.zoomOut': ElectronWindow.wrapWindowCommand(ElectronWindow.zoomOut),
}
