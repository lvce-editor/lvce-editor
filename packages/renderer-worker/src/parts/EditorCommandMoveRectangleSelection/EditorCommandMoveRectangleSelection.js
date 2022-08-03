import * as Editor from '../Editor/Editor.js'
import * as EditorMoveSelection from '../EditorCommandMoveSelection/EditorCommandMoveSelection.js'

export const editorMoveRectangleSelection = (editor, position) => {
  const anchor = EditorMoveSelection.state.position
  const startRowIndex = anchor.rowIndex
  const startColumnIndex = anchor.columnIndex
  const endRowIndex = position.rowIndex
  const endColumnIndex = position.columnIndex
  const selectionEdits = []
  for (let i = startRowIndex; i <= endRowIndex; i++) {
    selectionEdits.push({
      start: {
        rowIndex: i,
        columnIndex: startColumnIndex,
      },
      end: {
        rowIndex: i,
        columnIndex: endColumnIndex,
      },
    })
  }
  const cursorEdits = [selectionEdits.at(-1).end]
  Editor.scheduleCursorsAndSelections(editor, cursorEdits, selectionEdits)
}
