import * as ElectronWindow from './ElectronWindow.js'

export const Commands = {
  'ElectronWindow.close': ElectronWindow.close,
  'ElectronWindow.maximize': ElectronWindow.maximize,
  'ElectronWindow.minimize': ElectronWindow.minimize,
  'ElectronWindow.toggleDevtools': ElectronWindow.toggleDevtools,
  'ElectronWindow.unmaximize': ElectronWindow.unmaximize,
  'ElectronWindow.zoomIn': ElectronWindow.zoomIn,
  'ElectronWindow.zoomOut': ElectronWindow.zoomOut,
}
