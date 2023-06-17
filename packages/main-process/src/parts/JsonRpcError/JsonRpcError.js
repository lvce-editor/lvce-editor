exports.JsonRpcError = class extends Error {
  constructor(message) {
    super(message)
    this.name = 'JsonRpcError'
  }
}
