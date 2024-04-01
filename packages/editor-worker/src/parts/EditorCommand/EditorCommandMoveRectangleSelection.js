// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as EditorHandleClick from './EditorCommandHandleSingleClick.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'

export const moveRectangleSelection = (editor, position) => {
  // @ts-ignore
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
  // @ts-ignore
  const cursorEdits = [selectionEdits.at(-1).end]
  // @ts-ignore
  Editor.scheduleCursorsAndSelections(editor, cursorEdits, selectionEdits)
}
