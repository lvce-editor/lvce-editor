const GetHelpfulChildProcessError = require('../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js')

exports.IpcError = class extends Error {
  constructor(message, stdout = '', stderr = '') {
    const betterMessage = GetHelpfulChildProcessError.getHelpfulChildProcessError(message, stdout, stderr)
    super(betterMessage)
    this.name = 'IpcError'
    this.stdout = stdout
    this.stderr = stderr
  }
}
