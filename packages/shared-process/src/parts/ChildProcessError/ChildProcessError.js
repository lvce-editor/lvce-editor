import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js'

export class ChildProcessError extends Error {
  constructor(stderr) {
    const { message, code, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
    super(message)
    this.name = 'ChildProcessError'
    if (code) {
      this.code = code
    }
    if (stack) {
    }
  }
}
