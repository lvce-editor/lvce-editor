import VError from 'verror'

/**
 *
 * @param {unknown} cause
 * @returns {cause is Error}
 */
const isError = (cause) => {
  // @ts-ignore
  return cause && cause.stack && cause.message
}

export class OperationalError extends VError {
  /**
   *
   * @param {{cause?:unknown, message:string, code:string, stack?:any, codeFrame?:any, category?:string, stderr?:string   }} param0
   */
  constructor({ cause, message, code, stack, codeFrame, category, stderr }) {
    if (isError(cause)) {
      super(cause, message)
    } else {
      super(message)
    }
    this.code = code
    this.originalStack = stack
    this.originalCodeFrame = codeFrame
    this.category = category
    this.stderr = stderr
  }
}
