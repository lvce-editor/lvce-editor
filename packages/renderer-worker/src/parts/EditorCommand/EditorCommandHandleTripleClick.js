import * as Assert from '../Assert/Assert.js'
import * as EditorSelectLine from './EditorCommandSelectLine.js'

// TODO rowIndex and columnIndex should already be set because of singleClick which occurred before triple click
export const handleTripleClick = (editor, modifier, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  return EditorSelectLine.selectLine(editor)
}
