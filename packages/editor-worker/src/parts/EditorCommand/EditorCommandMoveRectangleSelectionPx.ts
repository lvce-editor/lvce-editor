import * as EditorMoveRectangleSelection from './EditorCommandMoveRectangleSelection.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// @ts-ignore
export const moveRectangleSelectionPx = (editor, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  EditorMoveRectangleSelection.moveRectangleSelection(editor, position)
}
