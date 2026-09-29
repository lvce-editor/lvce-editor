import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ProcessDisplayName from '../ProcessDisplayName/ProcessDisplayName.ts'

export class CommandNotFoundError extends Error {
  code: any

  constructor(id: any) {
    super(`Command ${id} not found in ${ProcessDisplayName.processDisplayName}`)
    this.name = 'CommandNotFoundError'
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}
