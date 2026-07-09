import { VError } from '../VError/VError.ts'

export class FileSystemError extends VError {
  code: any

  constructor(error: any, message: any) {
    super(error, message)
    if (error && error.code) {
      this.code = error.code
    }
  }
}
