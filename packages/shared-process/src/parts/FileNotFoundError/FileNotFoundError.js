import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { VError } from '../VError/VError.js'

const getDisplayPath = (path) => {
  if (path === '') {
    return '<empty string>'
  }
  return path
}

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found: '${getDisplayPath(path)}'`)
    this.name = 'FileNotFoundError'
    this.code = ErrorCodes.ENOENT
  }
}
