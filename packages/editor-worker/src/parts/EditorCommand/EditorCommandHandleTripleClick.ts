import * as Assert from '../Assert/Assert.ts'
import * as EditorSelectLine from './EditorCommandSelectLine.ts'

// TODO rowIndex and columnIndex should already be set because of singleClick which occurred before triple click
// @ts-ignore
export const handleTripleClick = (editor, modifier, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  return {
    newState: EditorSelectLine.selectLine(editor),
    commands: [],
  }
}
