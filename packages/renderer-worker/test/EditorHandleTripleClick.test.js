import * as EditorHandleTripleClick from '../src/parts/EditorCommandHandleTripleClick/EditorCommandHandleTripleClick.js'

test.skip('editorHandleTripleClick', () => {
  const editor = {
    lines: ['word1 word2 word3', 'word4 word5 word6'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
  }
  expect(
    EditorHandleTripleClick.editorHandleTripleClick(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
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
