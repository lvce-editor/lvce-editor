import * as Command from '../Command/Command.js'
import * as Electron from './Electron.js'

export const __initialize__ = () => {
  Command.register('Electron.toggleDevtools', Electron.toggleDevtools)
  Command.register('Electron.windowMinimize', Electron.windowMinimize)
  Command.register('Electron.windowMaximize', Electron.windowMaximize)
  Command.register('Electron.windowUnmaximize', Electron.windowUnmaximize)
  Command.register('Electron.windowClose', Electron.windowClose)
  Command.register('Electron.about', Electron.about)
  Command.register('Electron.showOpenDialog', Electron.showOpenDialog)
  Command.register('Electron.windowReload', Electron.windowReload)
  Command.register('Electron.getPerformanceEntries', Electron.getPerformanceEntries)
  Command.register('Electron.crashMainProcess', Electron.crashMainProcess)
  Command.register('Electron.showMessageBox', Electron.showMessageBox)
  Command.register('Electron.windowOpenNew', Electron.windowOpenNew)
  Command.register('Electron.exit', Electron.exit)
  Command.register('Electron.openProcessExplorer', Electron.openProcessExplorer)
}
