import * as ElectronDialog from './ElectronDialog.ts'

export const name = 'ElectronDialog'

export const Commands = {
  showMessageBox: ElectronDialog.showMessageBox,
  showOpenDialog: ElectronDialog.showOpenDialog,
  showSaveDialog: ElectronDialog.showSaveDialog,
}
