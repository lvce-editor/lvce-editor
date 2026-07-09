import * as ElectronProcess from './ElectronProcess.ts'

export const name = 'ElectronProcess'

export const Commands = {
  getChromeVersion: ElectronProcess.getChromeVersion,
  getElectronVersion: ElectronProcess.getElectronVersion,
}
