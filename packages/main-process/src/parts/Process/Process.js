const Assert = require('../Assert/Assert.js')

exports.kill = (pid, signal) => {
  Assert.number(pid)
  Assert.string(signal)
  process.kill(pid)
}

exports.exit = (code) => {
  Assert.number(code)
  process.exit(code)
}

exports.on = (event, listener) => {
  process.on(event, listener)
}

exports.getElectronVersion = () => {
  return process.versions.electron
}

exports.getChromeVersion = () => {
  return process.versions.chrome
}

exports.getNodeVersion = () => {
  return process.versions.node
}

exports.getV8Version = () => {
  return process.versions.v8
}

exports.cwd = () => {
  return process.cwd()
}

exports.pid = process.pid

exports.execPath = process.execPath
