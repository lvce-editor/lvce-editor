import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const getEditorErrorMessage = (error) => {
  if (error && error.code && error.code === ErrorCodes.EACCES) {
    return `The editor could not be opened due to a permission error: ${error.code}: permission denied.`
  }
  if (error && error.code && error.code === ErrorCodes.ENOENT) {
    return `The editor could not be opened because the file was not found.`
  }
  return `${error}`
}
