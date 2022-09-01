import * as EditorSelectWord from './EditorCommandSelectWord.js'
import * as EditorPosition from './EditorCommandPosition.js'
import * as Assert from '../Assert/Assert.js'

export const editorHandleDoubleClick = (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  return EditorSelectWord.editorSelectWord(
    editor,
    position.rowIndex,
    position.columnIndex
  )
}
