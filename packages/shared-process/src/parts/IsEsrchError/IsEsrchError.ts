import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEsrchError = (error) => {
  return error && error.code === ErrorCodes.ESRCH
}
