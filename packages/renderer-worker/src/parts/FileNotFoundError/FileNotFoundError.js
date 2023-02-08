import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export class FileNotFoundError extends Error {
  constructor(path) {
    super(`File not found '${path}'`)
    this.code = ErrorCodes.ENOENT
    this.name = 'FileNotFoundError'
  }
}
