import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'
import * as Assert from '../Assert/Assert.js'

export const editorMoveSelectionPx = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
