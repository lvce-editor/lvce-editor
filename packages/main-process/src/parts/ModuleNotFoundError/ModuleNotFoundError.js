const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')

class ModuleNotFoundError extends Error {
  constructor(id) {
    super(`Module ${id} not found`)
    this.name = 'ModuleNotFoundError'
    this.code = ErrorCodes.E_MODULE_NOT_FOUND
  }
}

exports.ModuleNotFoundError = ModuleNotFoundError
