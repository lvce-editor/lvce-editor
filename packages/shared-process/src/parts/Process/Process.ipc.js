import * as Process from './Process.js'

export const name = 'Process'

export const Commands = {
  crash: Process.crash,
  crashAsync: Process.crashAsync,
  getNodeVersion: Process.getNodeVersion,
  getPid: Process.getPid,
  getV8Version: Process.getV8Version,
  kill: Process.kill,
  getArch: Process.getArch,
}
