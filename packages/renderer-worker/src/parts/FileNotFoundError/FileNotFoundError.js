import * as ErrorCodes from '../../../../main-process/src/parts/ErrorCodes/ErrorCodes.js'

export class FileNotFoundError extends Error {
  constructor(path) {
    super(`File not found '${path}'`)
    this.code = ErrorCodes.ENOENT
    this.name = 'FileNotFoundError'
  }
}
