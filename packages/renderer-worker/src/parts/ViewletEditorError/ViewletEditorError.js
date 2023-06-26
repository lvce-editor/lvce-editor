import * as GetEditorErrorMessage from '../GetEditorErrorMessage/GetEditorErrorMessage.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    message: '',
    id,
    uri,
    x,
    y,
    width,
    height,
  }
}

export const setError = (state, error) => {
  const message = GetEditorErrorMessage.getEditorErrorMessage(error)
  return {
    ...state,
    message,
  }
}
