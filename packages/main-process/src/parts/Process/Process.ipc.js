const Process = require('./Process.js')

exports.name = 'Process'

exports.Commands = {
  getChromeVersion: Process.getChromeVersion,
  getElectronVersion: Process.getElectronVersion,
  getNodeVersion: Process.getNodeVersion,
  getPid: Process.getPid,
  getV8Version: Process.getV8Version,
  kill: Process.kill,
}
