import * as EditorSelectWord from '../EditorCommandSelectWord/EditorCommandSelectWord.js'
import * as EditorPosition from '../EditorCommandPosition/EditorCommandPosition.js'

export const editorHandleDoubleClick = (editor, x, y, offset) => {
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorSelectWord.editorSelectWord(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
