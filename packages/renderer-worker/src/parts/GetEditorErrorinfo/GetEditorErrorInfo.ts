import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as EditorErrorType from '../EditorErrorType/EditorErrorType.ts'
import type { EditorErrorInfo } from '../EditorErrorInfo/EditorErrorInfo.ts'

const isFileNotFoundError = (error: any) => {
  return error && error.code === ErrorCodes.ENOENT
}

export const getEditorErrorInfo = (error: any): EditorErrorInfo => {
  if (isFileNotFoundError(error)) {
    return {
      type: EditorErrorType.Error,
      message: 'The editor could not be opened because the file was not found',
      actions: [
        {
          name: 'Create File',
        },
      ],
    }
  }
  return {
    type: EditorErrorType.Error,
    message: `${error}`,
    actions: [],
  }
}
