import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export class NoProviderFoundError extends Error {
  constructor(message) {
    super(message)
    this.code = ErrorCodes.E_NO_PROVIDER_FOUND
  }
}
