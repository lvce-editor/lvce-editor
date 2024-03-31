export class NonError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NonError'
  }
}
