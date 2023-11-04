import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js'
import { VError } from '../VError/VError.js'

export class IpcError extends VError {
  constructor(message, stdout = '', stderr = '') {
    if (stdout || stderr) {
      const cause = GetHelpfulChildProcessError.getHelpfulChildProcessError(message, stdout, stderr)
      super(cause, message)
    } else {
      super(message)
    }
    this.name = 'IpcError'
    this.stdout = stdout
    this.stderr = stderr
  }
}
