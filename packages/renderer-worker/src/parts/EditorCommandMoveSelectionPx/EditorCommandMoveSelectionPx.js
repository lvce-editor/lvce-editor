import * as Assert from '../Assert/Assert.js'
import * as EditorMoveSelection from '../EditorCommandMoveSelection/EditorCommandMoveSelection.js'
import * as EditorPosition from '../EditorCommandPosition/EditorCommandPosition.js'

export const editorMoveSelectionPx = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
