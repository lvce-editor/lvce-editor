import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export class ModuleNotFoundError extends Error {
  constructor(id) {
    super(`Module ${id} not found`)
    this.name = 'ModuleNotFoundError'
    this.code = ErrorCodes.E_MODULE_NOT_FOUND
  }
}
