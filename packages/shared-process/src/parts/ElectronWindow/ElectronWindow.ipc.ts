import * as ElectronWindow from './ElectronWindow.ts'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.close,
  focus: ElectronWindow.focus,
  getZoom: ElectronWindow.getZoom,
  maximize: ElectronWindow.maximize,
  minimize: ElectronWindow.minimize,
  openNew: ElectronWindow.openNew,
  openNewWithUri: ElectronWindow.openNewWithUri,
  reload: ElectronWindow.reload,
  toggleDevtools: ElectronWindow.toggleDevtools,
  unmaximize: ElectronWindow.unmaximize,
  zoomIn: ElectronWindow.zoomIn,
  zoomOut: ElectronWindow.zoomOut,
  zoomReset: ElectronWindow.zoomReset,
}
