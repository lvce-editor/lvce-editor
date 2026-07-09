import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEsrchError = (error: any): any => {
  return error && error.code === ErrorCodes.ESRCH
}
