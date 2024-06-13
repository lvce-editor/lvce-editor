import * as EditorSelectWord from './EditorCommandSelectWord.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// @ts-ignore
export const handleDoubleClick = (editor, modifier, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  return { newState: EditorSelectWord.selectWord(editor, position.rowIndex, position.columnIndex), commands: [] }
}
