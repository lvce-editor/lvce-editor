import * as EditorDeleteAllRight from '../src/parts/EditorCommand/EditorCommandDeleteAllRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteAllRight - at start', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['1 2 3 4 5'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteAllRight.editorDeleteAllRight(editor)).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteAllRight in middle', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
  }
  const editor = {
    lines: ['1 2 3 4 5'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteAllRight.editorDeleteAllRight(editor)).toMatchObject({
    lines: ['1 2 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
})
