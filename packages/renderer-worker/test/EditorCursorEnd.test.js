import * as EditorCursorEnd from '../src/parts/EditorCommand/EditorCommandCursorEnd.js'

test('editorCursorEnd', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['aaaaa'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursorEnd.editorCursorEnd(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
})

test('editorCursorEnd - with selection', () => {
  const editor = {
    lines: ['aaaaa'],
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
  expect(EditorCursorEnd.editorCursorEnd(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
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
