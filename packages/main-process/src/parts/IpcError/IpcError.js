exports.IpcError = class extends Error {
  constructor(message, stdout = '', stderr = '') {
    super(message)
    this.name = 'IpcError'
    this.stdout = stdout
    this.stderr = stderr
  }
}
