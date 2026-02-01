import * as ElectronDialog from './ElectronDialog.js'

export const name = 'ElectronDialog'

export const Commands = {
  showMessageBox: ElectronDialog.showMessageBox,
  showOpenDialog: ElectronDialog.showOpenDialog,
  showSaveDialog: ElectronDialog.showSaveDialog,
}
