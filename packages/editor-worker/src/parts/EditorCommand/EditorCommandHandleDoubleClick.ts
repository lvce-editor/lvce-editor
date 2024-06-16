import * as EditorPosition from './EditorCommandPosition.ts'
import * as EditorSelectWord from './EditorCommandSelectWord.ts'

export const handleDoubleClick = (editor: any, modifier: any, x: number, y: number) => {
  const position = EditorPosition.at(editor, x, y)
  return EditorSelectWord.selectWord(editor, position.rowIndex, position.columnIndex)
}
