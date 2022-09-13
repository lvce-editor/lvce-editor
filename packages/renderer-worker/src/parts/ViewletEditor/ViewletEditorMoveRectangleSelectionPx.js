import * as EditorMoveRectangleSelection from './ViewletEditorMoveRectangleSelection.js/index.js'
import * as EditorPosition from './ViewletEditorPosition.js/index.js'

export const editorMoveRectangleSelectionPx = (editor, x, y) => {
  const position = EditorPosition.at(editor, x, y)
  EditorMoveRectangleSelection.editorMoveRectangleSelection(editor, position)
}
