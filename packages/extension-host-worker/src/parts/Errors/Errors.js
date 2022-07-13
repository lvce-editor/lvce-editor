export class ExtensionActivationError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ExtensionActivationError'
  }
}
