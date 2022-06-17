import * as EditorSelectLine from '../src/parts/EditorCommand/EditorCommandSelectLine.js'

// TODO test with multiple cursors
test('editorSelectLine', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['word1 word2 word3', 'word4 word5 word6'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorSelectLine.editorSelectLine(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 17,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 17,
        },
      },
    ],
  })
})
