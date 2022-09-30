import VError from 'verror'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found '${path}'`)
    this.name = 'FileNotFoundError'
    this.code = FileSystemErrorCodes.ENOENT
  }
}
