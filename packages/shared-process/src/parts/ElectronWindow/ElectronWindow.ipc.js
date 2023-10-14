import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.close,
  maximize: ElectronWindow.maximize,
  minimize: ElectronWindow.minimize,
  reload: ElectronWindow.reload,
  toggleDevtools: ElectronWindow.toggleDevtools,
  unmaximize: ElectronWindow.unmaximize,
  zoomIn: ElectronWindow.zoomIn,
  zoomOut: ElectronWindow.zoomOut,
  zoomReset: ElectronWindow.zoomReset,
  openNew: ElectronWindow.openNew,
  focus: ElectronWindow.focus,
}
