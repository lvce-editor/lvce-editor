import * as Assert from '../Assert/Assert.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const moveSelectionPx = (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
