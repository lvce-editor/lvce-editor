import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.wrapWindowCommand(ElectronWindow.close),
  focus: ElectronWindow.wrapWindowCommand(ElectronWindow.focus),
  maximize: ElectronWindow.wrapWindowCommand(ElectronWindow.maximize),
  minimize: ElectronWindow.wrapWindowCommand(ElectronWindow.minimize),
  reload: ElectronWindow.wrapWindowCommand(ElectronWindow.reload),
  toggleDevtools: ElectronWindow.wrapWindowCommand(ElectronWindow.toggleDevtools),
  unmaximize: ElectronWindow.wrapWindowCommand(ElectronWindow.unmaximize),
  zoomIn: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomIn),
  zoomOut: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomOut),
  zoomReset: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomReset),
}
