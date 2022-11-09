import * as Assert from '../Assert/Assert.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const moveSelectionPx = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
