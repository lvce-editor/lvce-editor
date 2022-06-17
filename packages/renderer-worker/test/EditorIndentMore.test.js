import * as EditorIndentMore from '../src/parts/EditorCommand/EditorCommandIndentMore.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorIndentMore - indent empty selection at start of line', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1'],
    cursor: cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    minLineY: 0,
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorIndentMore.editorIndentMore(editor)).toMatchObject({
    lines: ['  line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
  })
})

test.skip('editorIndentMore - indent one selection - single line', async () => {
  const editor = {
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
    minLineY: 0,
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(EditorIndentMore.editorIndentMore(editor)).toMatchObject({
    lines: ['  line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 8,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 8,
        },
      },
    ],
  })
})

test.skip('editorIndentMore - indent one selection - multiple lines', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(EditorIndentMore.editorIndentMore(editor)).toMatchObject({
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 3,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 4,
    },
  })
})
