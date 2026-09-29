import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEnoentError = (error) => {
  return error && error.code === ErrorCodes.ENOENT
}
