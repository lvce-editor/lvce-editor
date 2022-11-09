import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.close,
  maximize: ElectronWindow.maximize,
  minimize: ElectronWindow.minimize,
  toggleDevtools: ElectronWindow.toggleDevtools,
  unmaximize: ElectronWindow.unmaximize,
  zoomIn: ElectronWindow.zoomIn,
  zoomOut: ElectronWindow.zoomOut,
}
