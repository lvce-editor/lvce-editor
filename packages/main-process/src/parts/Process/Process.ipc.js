const Process = require('./Process.js')

exports.name = 'Process'

exports.Commands = {
  getPid: Process.getPid,
  kill: Process.kill,
  getNodeVersion: Process.getNodeVersion,
  getChromeVersion: Process.getChromeVersion,
  getElectronVersion: Process.getElectronVersion,
  getV8Version: Process.getV8Version,
}
