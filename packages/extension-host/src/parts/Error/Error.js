import VError from 'verror'

export class ExecutionError extends VError {
  /**
   *
   * @param {{cause:unknown, message:string}} param0
   */
  constructor({ cause, message }) {
    // tries to include error name in the message
    // so that it is more obvious, e.g.
    // "x is not defined" vs "ReferenceError: x is not defined"
    // @ts-ignore
    const causeString = cause.toString()
    const causePrefix = causeString.slice(0, causeString.indexOf(':'))
    if (causePrefix !== 'Error') {
      cause.message = causePrefix + ': ' + cause.message
    }
    // @ts-ignore
    super(cause, message)
    this.internalMessage = message
  }
}
