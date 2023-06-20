import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const shouldLogError = (error) => {
  if (error && error.code === ErrorCodes.ENOENT) {
    return false
  }
  return true
}
