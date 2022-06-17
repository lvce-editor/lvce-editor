import * as EditorCancelSelection from '../src/parts/EditorCommand/EditorCommandCancelSelection.js'

test('editorCancelSelection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
    ],
  }
  expect(EditorCancelSelection.editorCancelSelection(editor)).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
  })
})

test('editorCancelSelection - when there is no selection', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCancelSelection.editorCancelSelection(editor)).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 4,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
    ],
  })
})
