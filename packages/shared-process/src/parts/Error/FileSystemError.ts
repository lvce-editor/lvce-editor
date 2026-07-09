import { VError } from '../VError/VError.ts'

export class FileSystemError extends VError {
  constructor(error, message) {
    super(error, message)
    if (error && error.code) {
      this.code = error.code
    }
  }
}
