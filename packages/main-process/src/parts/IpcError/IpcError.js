const GetHelpfulChildProcessError = require('../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js')
const { VError } = require('../VError/VError.js')

exports.IpcError = class extends VError {
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
