const ElectronWindow = require('./ElectronWindow.js')

// prettier-ignore
exports.Commands = {
  'ElectronWindow.minimize': ElectronWindow.wrapWindowCommand(ElectronWindow.minimize),
  'ElectronWindow.maximize': ElectronWindow.wrapWindowCommand(ElectronWindow.maximize),
  'ElectronWindow.toggleDevtools': ElectronWindow.wrapWindowCommand(ElectronWindow.toggleDevtools),
  'ElectronWindow.unmaximize': ElectronWindow.wrapWindowCommand(ElectronWindow.unmaximize),
  'ElectronWindow.close': ElectronWindow.wrapWindowCommand(ElectronWindow.close),
  'ElectronWindow.reload': ElectronWindow.wrapWindowCommand(ElectronWindow.reload),
}
