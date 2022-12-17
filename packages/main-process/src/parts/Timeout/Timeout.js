const NodeTimers = require('node:timers/promises')

exports.setTimeout = async (timeout) => {
  await NodeTimers.setTimeout(timeout)
}
