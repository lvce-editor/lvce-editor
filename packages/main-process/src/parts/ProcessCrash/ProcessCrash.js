const Timeout = require('../Timeout/Timeout.js')

const handleTimeout = () => {
  throw new Error('oops')
}

exports.crash = () => {
  Timeout.setTimeout(handleTimeout, 0)
}

const handleTimeoutAsync = async () => {
  throw new Error('oops')
}

exports.crashAsync = () => {
  Timeout.setTimeout(handleTimeoutAsync, 0)
}

exports.hang = () => {
  process.hang()
}
