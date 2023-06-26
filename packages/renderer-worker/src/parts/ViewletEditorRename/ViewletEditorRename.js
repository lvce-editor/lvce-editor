import * as Assert from '../Assert/Assert.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as Rename from '../Rename/Rename.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const prepareRename = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  return Rename.prepareRename(editor, offset)
}

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uri,
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const editor = getEditor()
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  // TODO handle error and add tests for handled error
  const prepareRenameResult = await prepareRename(editor, rowIndex, columnIndex)
  // TODO race condition, what is when editor is closed before promise resolves
  if (prepareRenameResult.canRename) {
    const x = EditorPosition.x(editor, rowIndex, columnIndex)
    const y = EditorPosition.y(editor, rowIndex)
    return {
      ...state,
      x,
      y,
    }
  } else {
    throw new Error('You cannot rename this element')
  }
}
