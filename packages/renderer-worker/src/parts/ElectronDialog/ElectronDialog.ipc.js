import * as ElectronDialog from './ElectronDialog.js'

export const name = 'ElectronDialog'

export const Commands = {
  mockOpenDialog: ElectronDialog.mockOpenDialog,
  resetMockOpenDialog: ElectronDialog.resetMockOpenDialog,
  showOpenDialog: ElectronDialog.showOpenDialog,
  showMessageBox: ElectronDialog.showMessageBox,
}
