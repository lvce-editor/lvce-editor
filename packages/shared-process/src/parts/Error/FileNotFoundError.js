import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { VError } from '../VError/VError.js'

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found '${path}'`)
    this.name = 'FileNotFoundError'
    this.code = ErrorCodes.ENOENT
  }
}
