exports.IpcError = class extends Error {
  constructor(message) {
    super(message)
    this.name = 'IpcError'
  }
}
