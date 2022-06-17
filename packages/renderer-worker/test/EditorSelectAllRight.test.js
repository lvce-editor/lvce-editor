import * as EditorSelectAllRight from '../src/parts/EditorCommand/EditorCommandSelectAllRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorSelectAllRight = at start', () => {
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
    tokenizer: TokenizePlainText,
  }
  expect(EditorSelectAllRight.editorSelectAllRight(editor)).toMatchObject({
    lines: ['1 2 3 4 5'],
    cursor: {
      rowIndex: 0,
      columnIndex: 9,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 9,
        },
      },
    ],
  })
})

test('editorSelectAllRight in middle', () => {
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
    tokenizer: TokenizePlainText,
  }
  expect(EditorSelectAllRight.editorSelectAllRight(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 9,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 5,
        },
        end: {
          rowIndex: 0,
          columnIndex: 9,
        },
      },
    ],
  })
})
