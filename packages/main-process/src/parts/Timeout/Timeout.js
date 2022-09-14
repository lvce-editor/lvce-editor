const NodeTimers = require('timers/promises')

exports.setTimeout = async (timeout) => {
  await NodeTimers.setTimeout(timeout)
}
