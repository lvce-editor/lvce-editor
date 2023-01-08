const NodeTimers = require('node:timers/promises')

exports.wait = async (timeout) => {
  await NodeTimers.setTimeout(timeout)
}

exports.setTimeout = (fn, timeout) => {
  setTimeout(fn, timeout)
}
