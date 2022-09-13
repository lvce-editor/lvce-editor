import * as Assert from '../Assert/Assert.js'
import * as EditorSelectLine from './ViewletEditorSelectLine.js'

// TODO rowIndex and columnIndex should already be set because of singleClick which occurred before triple click
export const editorHandleTripleClick = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  return EditorSelectLine.editorSelectLine(editor)
}
