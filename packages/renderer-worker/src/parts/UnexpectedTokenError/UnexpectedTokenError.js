export class UnexpectedTokenError extends Error {
  constructor() {
    super('Unexpected token')
    this.name = 'UnexpectedTokenError'
  }
}
