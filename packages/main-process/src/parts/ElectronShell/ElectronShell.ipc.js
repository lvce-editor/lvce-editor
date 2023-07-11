import * as ElectronShell from './ElectronShell.cjs'

export const name = 'ElectronShell'

export const Commands = {
  beep: ElectronShell.beep,
  openExternal: ElectronShell.openExternal,
  openPath: ElectronShell.showItemInFolder,
  showItemInFolder: ElectronShell.showItemInFolder,
}
