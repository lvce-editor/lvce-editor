import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { VError } from '../VError/VError.ts'

const getDisplayPath = (path: any): any => {
  if (path === '') {
    return '<empty string>'
  }
  return path
}

export class FileNotFoundError extends VError {
  code: any

  constructor(path: any) {
    super(`File not found: '${getDisplayPath(path)}'`)
    this.code = ErrorCodes.ENOENT
  }
}
