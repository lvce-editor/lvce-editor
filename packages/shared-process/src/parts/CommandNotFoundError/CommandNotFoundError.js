import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ProcessDisplayName from '../ProcessDisplayName/ProcessDisplayName.js'

export class CommandNotFoundError extends Error {
  constructor(id) {
    super(`command ${id} not found in ${ProcessDisplayName.processDisplayName}`)
    this.name = 'CommandNotFoundError'
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}
