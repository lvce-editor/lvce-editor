import * as EditorMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.js'
import * as EditorMoveSelectionPx from '../src/parts/EditorCommand/EditorCommandMoveSelectionPx.js'

test.skip('moveSelectionPx', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
    selections: [],
    top: 10,
    left: 10,
    rowHeight: 20,
    columnWidth: 8,
    deltaY: 0,
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 1,
  }
  EditorMoveSelectionPx.moveSelectionPx(editor, 30, 50)
  expect(editor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 1,
      },
      end: {
        rowIndex: 2,
        columnIndex: 2,
      },
    },
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 2,
  })
})
