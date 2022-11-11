const ElectronWindow = require('./ElectronWindow.js')

exports.name = 'ElectronWindow'

// prettier-ignore
exports.Commands = {
  close: ElectronWindow.wrapWindowCommand(ElectronWindow.close),
  focus: ElectronWindow.wrapWindowCommand(ElectronWindow.focus),
  maximize: ElectronWindow.wrapWindowCommand(ElectronWindow.maximize),
  minimize: ElectronWindow.wrapWindowCommand(ElectronWindow.minimize),
  reload: ElectronWindow.wrapWindowCommand(ElectronWindow.reload),
  toggleDevtools: ElectronWindow.wrapWindowCommand(ElectronWindow.toggleDevtools),
  unmaximize: ElectronWindow.wrapWindowCommand(ElectronWindow.unmaximize),
  zoomIn: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomIn),
  zoomOut: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomOut),
}
