import * as ElectronWindow from './ElectronWindow.ts'

export const name = 'ElectronWindow'

export const Commands = {
  close: ElectronWindow.close,
  completeEditorTransfer: ElectronWindow.completeEditorTransfer,
  focus: ElectronWindow.focus,
  getZoom: ElectronWindow.getZoom,
  maximize: ElectronWindow.maximize,
  minimize: ElectronWindow.minimize,
  openNew: ElectronWindow.openNew,
  openNewWithEditorInput: ElectronWindow.openNewWithEditorInput,
  openNewWithUri: ElectronWindow.openNewWithUri,
  reload: ElectronWindow.reload,
  setBrowserFullWidthGestureEnabled: ElectronWindow.setBrowserFullWidthGestureEnabled,
  takeEditorTransfer: ElectronWindow.takeEditorTransfer,
  toggleDevtools: ElectronWindow.toggleDevtools,
  toggleFullScreen: ElectronWindow.toggleFullScreen,
  toggleMaximize: ElectronWindow.toggleMaximize,
  unmaximize: ElectronWindow.unmaximize,
  zoomIn: ElectronWindow.zoomIn,
  zoomOut: ElectronWindow.zoomOut,
  zoomReset: ElectronWindow.zoomReset,
}
