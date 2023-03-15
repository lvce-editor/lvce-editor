const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')

class CommandNotFoundError extends Error {
  constructor(id) {
    super(`command ${id} not found`)
    this.name = 'CommandNotFoundError'
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}

exports.CommandNotFoundError = CommandNotFoundError
