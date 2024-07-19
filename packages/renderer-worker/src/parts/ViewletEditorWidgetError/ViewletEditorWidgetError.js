import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
// @ts-ignore
import * as Assert from '../Assert/Assert.ts'
// @ts-ignore
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uri,
    width,
    height,
    message: '',
  }
}

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

const getDisplayErrorMessage = (error) => {
  const message = `${error}`
  const errorPrefix = 'Error: '
  if (message.startsWith(errorPrefix)) {
    return message.slice(errorPrefix.length)
  }
  return message
}

export const setError = (state, error) => {
  const message = getDisplayErrorMessage(error)
  const editor = getEditor()
  const rowIndex = 0
  const columnIndex = 0
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  return {
    ...state,
    message,
    x,
    y,
  }
}
