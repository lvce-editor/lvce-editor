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
