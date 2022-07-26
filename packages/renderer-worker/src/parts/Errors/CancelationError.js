export class CancelationError extends Error {
  constructor() {
    super('canceled')
    this.name = 'CancelationError'
  }
}
