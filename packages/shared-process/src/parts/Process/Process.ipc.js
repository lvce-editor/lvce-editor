import * as Process from './Process.js'

export const Commands = {
  'Process.crash': Process.crash,
  'Process.crashAsync': Process.crashAsync,
  'Process.getArch': Process.getArch,
  'Process.getNodeVersion': Process.getNodeVersion,
  'Process.getPid': Process.getPid,
  'Process.getV8Version': Process.getV8Version,
  'Process.kill': Process.kill,
}
