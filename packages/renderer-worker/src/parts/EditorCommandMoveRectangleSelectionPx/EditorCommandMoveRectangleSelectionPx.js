import * as EditorMoveRectangleSelection from '../EditorCommandMoveRectangleSelection/EditorCommandMoveRectangleSelection.js'
import * as EditorPosition from '../EditorCommandPosition/EditorCommandPosition.js'

export const editorMoveRectangleSelectionPx = (editor, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  EditorMoveRectangleSelection.editorMoveRectangleSelection(editor, position)
}
