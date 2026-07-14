import * as ElectronProcess from './ElectronProcess.ts'

export const name = 'ElectronProcess'

export const Commands = {
  getArgv: ElectronProcess.getArgv,
  getChromeVersion: ElectronProcess.getChromeVersion,
  getElectronVersion: ElectronProcess.getElectronVersion,
  writeStderr: ElectronProcess.writeStderr,
  writeStdout: ElectronProcess.writeStdout,
}
