import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export class NoProviderFoundError extends Error {
  constructor(message) {
    super(message)
    // @ts-ignore
    this.code = ErrorCodes.E_NO_PROVIDER_FOUND
  }
}
