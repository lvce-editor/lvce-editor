import * as EditorDeleteAllLeft from '../src/parts/EditorCommand/EditorCommandDeleteAllLeft.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteAllLeft', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 9,
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
  expect(EditorDeleteAllLeft.editorDeleteAllLeft(editor)).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteAllLeft in middle', () => {
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
  expect(EditorDeleteAllLeft.editorDeleteAllLeft(editor)).toMatchObject({
    lines: [' 4 5'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test.skip('editorDeleteAllLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 1,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 2,
        },
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(EditorDeleteAllLeft.editorDeleteAllLeft(editor)).toMatchObject({
    line: ['lne 2'],
    selections: [],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorDeleteAllLeft - at start of line', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 0,
  }
  const editor = {
    lines: ['1', '2'],
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
  expect(EditorDeleteAllLeft.editorDeleteAllLeft(editor)).toMatchObject({
    lines: ['12'],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorDeleteAllLeft - at start of file', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['1', '2'],
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
  expect(EditorDeleteAllLeft.editorDeleteAllLeft(editor)).toMatchObject({
    lines: ['1', '2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})
