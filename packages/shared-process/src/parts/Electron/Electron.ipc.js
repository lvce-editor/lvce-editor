import * as Electron from './Electron.js'

export const Commands = {
  'Electron.toggleDevtools': Electron.toggleDevtools,
  'Electron.windowMinimize': Electron.windowMinimize,
  'Electron.windowMaximize': Electron.windowMaximize,
  'Electron.windowUnmaximize': Electron.windowUnmaximize,
  'Electron.windowClose': Electron.windowClose,
  'Electron.about': Electron.about,
  'Electron.showOpenDialog': Electron.showOpenDialog,
  'Electron.windowReload': Electron.windowReload,
  'Electron.getPerformanceEntries': Electron.getPerformanceEntries,
  'Electron.crashMainProcess': Electron.crashMainProcess,
  'Electron.showMessageBox': Electron.showMessageBox,
  'Electron.windowOpenNew': Electron.windowOpenNew,
  'Electron.exit': Electron.exit,
  'Electron.openProcessExplorer': Electron.openProcessExplorer,
}
