import * as DetachedEditor from '../DetachedEditor/DetachedEditor.js'
import * as ElectronWindow from './ElectronWindow.js'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.close,
  maximize: ElectronWindow.maximize,
  minimize: ElectronWindow.minimize,
  openNew: ElectronWindow.openNew,
  openNewWithUri: ElectronWindow.openNewWithUri,
  openNewWithEditorInput: DetachedEditor.openNewWithEditorInput,
  toggleDevtools: ElectronWindow.toggleDevtools,
  toggleFullScreen: ElectronWindow.toggleFullScreen,
  toggleMaximize: ElectronWindow.toggleMaximize,
  unmaximize: ElectronWindow.unmaximize,
  zoomIn: ElectronWindow.zoomIn,
  zoomOut: ElectronWindow.zoomOut,
  zoomReset: ElectronWindow.zoomReset,
}
