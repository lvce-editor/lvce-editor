import * as Process from './Process.js'

export const name = 'Process'

export const Commands = {
  getNodeVersion: Process.getNodeVersion,
  getElectronVersion: Process.getElectronVersion,
  getChromeVersion: Process.getChromeVersion,
  getV8Version: Process.getV8Version,
  getArch: Process.getArch,
  getCommit: Process.getCommit,
  getVersion: Process.getVersion,
  getProductNameLong: Process.getProductNameLong,
}
