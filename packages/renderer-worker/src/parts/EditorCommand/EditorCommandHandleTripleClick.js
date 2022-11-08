import * as Assert from '../Assert/Assert.js'
import * as EditorSelectLine from './EditorCommandSelectLine.js'

// TODO rowIndex and columnIndex should already be set because of singleClick which occurred before triple click
export const handleTripleClick = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  return EditorSelectLine.selectLine(editor)
}
