import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  minimize: ElectronWindow.minimize,
  maximize: ElectronWindow.maximize,
  toggleDevtools: ElectronWindow.toggleDevtools,
  unmaximize: ElectronWindow.unmaximize,
  close: ElectronWindow.close,
  reload: ElectronWindow.reload,
}
