import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ProcessName from '../ProcessName/ProcessName.ts'

export class CommandNotFoundError extends Error {
  constructor(id) {
    super(`Command "${id}" not found (${ProcessName.processName})`)
    this.name = 'CommandNotFoundError'
    // @ts-expect-error
    this.code = ErrorCodes.E_COMMAND_NOT_FOUND
  }
}
