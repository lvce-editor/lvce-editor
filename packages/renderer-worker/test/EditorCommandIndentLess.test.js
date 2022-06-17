import * as EditorIndentLess from '../src/parts/EditorCommand/EditorCommandIndentLess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test.skip('editorIndentLess - already at start of line', () => {
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
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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

test.skip('editorIndentLess - indented by one space', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [' line 1'],
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
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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

test('editorIndentLess - indented by two spaces', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['  line 1'],
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
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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

test.skip('editorIndentLess - indented by tab', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['\tline 1'],
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
  }
  expect(EditorIndentLess.editorIndentLess(editor)).toMatchObject({
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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
