const Assert = require('../Assert/Assert.js')

exports.kill = (pid, signal) => {
  Assert.number(pid)
  Assert.string(signal)
  process.kill(pid)
}
