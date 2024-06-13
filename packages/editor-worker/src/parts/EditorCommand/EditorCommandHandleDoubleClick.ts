import * as EditorSelectWord from './EditorCommandSelectWord.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const handleDoubleClick = (editor, modifier, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  return { newState: EditorSelectWord.selectWord(editor, position.rowIndex, position.columnIndex), commands: [] }
}
