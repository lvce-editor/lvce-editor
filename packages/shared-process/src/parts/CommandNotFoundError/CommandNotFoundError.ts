import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ProcessDisplayName from '../ProcessDisplayName/ProcessDisplayName.ts'

export class CommandNotFoundError extends Error {
  constructor(id) {
    super(`Command ${id} not found in ${ProcessDisplayName.processDisplayName}`)
    this.name = 'CommandNotFoundError'
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}
