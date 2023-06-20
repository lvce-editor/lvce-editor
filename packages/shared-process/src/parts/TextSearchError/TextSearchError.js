import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'

export class TextSearchError extends Error {
  constructor(cause) {
    if (IsEnoentError.isEnoentError(cause)) {
      super(`ripgrep path not found: ${cause}`)
      this.code = ErrorCodes.E_RIP_GREP_NOT_FOUND
    } else {
      super(`ripgrep process error: ${cause}`)
      this.code = cause.code
    }
    this.name = 'TextSearchError'
  }
}
