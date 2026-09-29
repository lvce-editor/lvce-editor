import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const shouldLogError = (error: any): any => {
  if (error && error.code === ErrorCodes.ENOENT) {
    return false
  }
  return true
}
