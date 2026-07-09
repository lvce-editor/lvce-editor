import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { VError } from '../VError/VError.ts'

const getDisplayPath = (path) => {
  if (path === '') {
    return '<empty string>'
  }
  return path
}

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found: '${getDisplayPath(path)}'`)
    this.code = ErrorCodes.ENOENT
  }
}
