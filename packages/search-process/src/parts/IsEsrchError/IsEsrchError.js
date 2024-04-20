import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const isEsrchError = (error) => {
  return error && error.code === ErrorCodes.ESRCH
}
