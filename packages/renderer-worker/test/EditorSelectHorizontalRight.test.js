import * as EditorSelectHorizontalRight from '../src/parts/EditorCommand/EditorCommandSelectHorizontalRight.js'

test('editorSelectHorizontalRight - single character', () => {
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
  expect(
    EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, () => 1)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
      },
    ],
  })
})
