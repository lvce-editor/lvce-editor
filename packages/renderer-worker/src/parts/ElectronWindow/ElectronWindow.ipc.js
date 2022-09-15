import * as ElectronWindow from './ElectronWindow.js'

export const Commands = {
  'ElectronWindow.close': ElectronWindow.close,
  'ElectronWindow.minimize': ElectronWindow.minimize,
  'ElectronWindow.unmaximize': ElectronWindow.unmaximize,
  'ElectronWindow.maximize': ElectronWindow.maximize,
  'ElectronWindow.toggleDevtools': ElectronWindow.toggleDevtools,
}
