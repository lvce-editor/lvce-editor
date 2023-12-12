import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  zoomIn: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomIn),
  zoomOut: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomOut),
  zoomReset: ElectronWindow.wrapWindowCommand(ElectronWindow.zoomReset),
  executeWindowFunction: ElectronWindow.executeWindowFunction,
  executeWebContentsFunction: ElectronWindow.executeWebContentsFunction,
}
