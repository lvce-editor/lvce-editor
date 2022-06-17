import * as EditorSelectAll from '../src/parts/EditorCommand/EditorCommandSelectAll.js'

test('editorSelectAll', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorSelectAll.editorSelectAll(editor)).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 3,
          columnIndex: 0,
        },
      },
    ],
    cursor: {
      rowIndex: 3,
      columnIndex: 0,
    },
  })
})
