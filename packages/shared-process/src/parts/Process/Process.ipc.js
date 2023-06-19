import * as Process from './Process.js'

export const name = 'Process'

export const Commands = {
  crash: Process.crash,
  crashAsync: Process.crashAsync,
  getPid: Process.getPid,
  kill: Process.kill,
  getV8Version: Process.getV8Version,
  getNodeVersion: Process.getNodeVersion,
}
