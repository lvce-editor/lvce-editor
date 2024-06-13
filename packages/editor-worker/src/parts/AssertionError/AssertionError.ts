export class AssertionError extends Error {
  // @ts-ignore
  constructor(message) {
    super(message)
    this.name = 'AssertionError'
  }
}
