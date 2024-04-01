import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ProcessName from '../ProcessName/ProcessName.js'

export class CommandNotFoundError extends Error {
  constructor(id) {
    super(`Command "${id}" not found (${ProcessName.processName})`)
    this.name = 'CommandNotFoundError'
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}
