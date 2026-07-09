import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const shouldLogError = (error) => {
  if (error && error.code === ErrorCodes.ENOENT) {
    return false
  }
  return true
}
