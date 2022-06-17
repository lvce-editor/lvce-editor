import * as EditorDeleteWordRight from '../src/parts/EditorCommand/EditorCommandDeleteWordRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteWordRight', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 7,
  }
  const editor = {
    lines: ['sample text'],
    cursor,
    selections: [{ start: cursor, end: cursor }],
    tokenizer: TokenizePlainText,
    lineCache: [],
    undoStack: [],
  }
  expect(EditorDeleteWordRight.editorDeleteWordRight(editor)).toMatchObject({
    lines: ['sample '],
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test.skip('editorDeleteWordRight - when there is not word right', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 7,
  }
  const editor = {
    lines: ['sample   '],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordRight.editorDeleteWordRight(editor)).toMatchObject({
    lines: ['sample  '],
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})
