import * as ElectronProcess from './ElectronProcess.js'

export const name = 'ElectronProcess'

export const Commands = {
  getChromeVersion: ElectronProcess.getChromeVersion,
  getElectronVersion: ElectronProcess.getElectronVersion,
}
