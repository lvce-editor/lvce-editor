import VError from 'verror'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found '${path}'`)
    this.name = 'FileNotFoundError'
    this.code = ErrorCodes.ENOENT
  }
}
