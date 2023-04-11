export class DepecratedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DeprecatedError'
  }
}
