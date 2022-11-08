import * as EditorMoveRectangleSelection from './EditorCommandMoveRectangleSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

export const moveRectangleSelectionPx = (editor, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  EditorMoveRectangleSelection.moveRectangleSelection(editor, position)
}
