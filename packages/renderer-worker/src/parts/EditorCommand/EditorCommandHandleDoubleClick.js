import * as EditorSelectWord from './EditorCommandSelectWord.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const handleDoubleClick = (editor, x, y, offset) => {
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorSelectWord.selectWord(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
