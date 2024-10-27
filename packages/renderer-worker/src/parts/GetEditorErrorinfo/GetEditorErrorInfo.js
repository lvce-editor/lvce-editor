import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

const isFileNotFoundError = (error) => {
  return error && error.code === ErrorCodes.ENOENT
}

export const getEditorErrorInfo = (error) => {
  if (isFileNotFoundError(error)) {
    return {
      type: 'error',
      message: 'The editor could not be opened because the file was not found',
      actions: [
        {
          name: 'Create File',
        },
      ],
    }
  }
  return {
    type: 'error',
    message: `${error}`,
    actions: [],
  }
}
