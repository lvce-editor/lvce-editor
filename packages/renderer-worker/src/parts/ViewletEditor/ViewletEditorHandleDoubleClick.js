import * as EditorSelectWord from './ViewletEditorSelectWord.js'
import * as EditorPosition from './ViewletEditorPosition.js/index.js'

export const editorHandleDoubleClick = (editor, x, y, offset) => {
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorSelectWord.editorSelectWord(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
