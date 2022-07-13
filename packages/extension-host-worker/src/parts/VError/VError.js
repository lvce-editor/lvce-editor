export class VError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VError'
  }
}
