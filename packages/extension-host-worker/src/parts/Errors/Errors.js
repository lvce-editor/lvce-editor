export class ExtensionActivationError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ExtensionActivationError'
  }
}

export class JsonRpcError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JsonRpcError'
  }
}
