import * as Process from './Process.js'

export const name = 'Process'

export const Commands = {
  getArgv: Process.getArgv,
  getChromeVersion: Process.getChromeVersion,
  getElectronVersion: Process.getElectronVersion,
  getNodeVersion: Process.getNodeVersion,
  getPid: Process.getPid,
  getV8Version: Process.getV8Version,
}
